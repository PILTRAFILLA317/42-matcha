// src/routes/api/sse/+server.ts
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { updateConnected } from '$lib/server/users';
import { updateLastConnection } from '$lib/server/users';

// Track active listeners per user
const activeListeners = new Map<
  string,
  {
    controller: ReadableStreamDefaultController;
    unsubscribe: () => Promise<void>;
  }
>();

// Single global listener for all notifications
let globalListener: Promise<void> | null = null;

async function setupGlobalListener() {
  if (globalListener) return globalListener;

  globalListener = db.listen(`user_notifications`, (payload) => {
    const userId = JSON.parse(payload).userID;
    const listener = activeListeners.get(userId);

    if (listener) {
      const encoder = new TextEncoder();
      listener.controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
      );
    }
  }).then(unlisten => {
    return () => unlisten().catch(console.error);
  });

  return globalListener;
}

export const GET: RequestHandler = async ({ locals }) => {
  const userId = locals.user?.userId;
  if (!userId) return new Response('Unauthorized', { status: 401 });

  // Set up global listener if not already running
  await setupGlobalListener();

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Send initial connection message
        controller.enqueue(encoder.encode('data: connected\n\n'));

        // Store controller reference
        updateConnected(userId);
        activeListeners.set(userId, { controller, unsubscribe: () => Promise.resolve() });

        // Cleanup on HMR
        if (import.meta.hot) {
          import.meta.hot.dispose(() => {
            updateLastConnection(userId);
            activeListeners.delete(userId);
          });
        }
      },
      cancel() {
        updateLastConnection(userId);
        activeListeners.delete(userId);
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    }
  );
};