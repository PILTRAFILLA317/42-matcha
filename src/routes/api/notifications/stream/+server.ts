// src/routes/api/sse/+server.ts
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

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
  console.log('Setting up global listener');
  if (globalListener) return globalListener;
  console.log('Global listener not set up, setting up now');

  globalListener = db.listen(`user_notifications`, (payload) => {
    // const userId = channel.replace('user_notifications_', '');
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
        activeListeners.set(userId, { controller, unsubscribe: () => Promise.resolve() });

        // Cleanup on HMR
        if (import.meta.hot) {
          import.meta.hot.dispose(() => {
            activeListeners.delete(userId);
          });
        }
      },
      cancel() {
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