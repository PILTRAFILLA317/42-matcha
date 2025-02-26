// src/routes/api/sse/+server.ts
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { getUsernameById } from '$lib/server/utils';

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

async function getReciverID(chatID: string, userID: string) {
  const chat = await db`SELECT * FROM chats WHERE id = ${chatID}`;
  if (chat.length === 0) {
    throw new Error('Chat not found');
    // return;
  }
  console.log('Chat:', chat);
  const receiverID = chat[0].user_1 === userID ? chat[0].user_2 : chat[0].user_1;
  console.log('Receiver ID:', receiverID);
  return receiverID;
}

async function setupGlobalListener() {
  console.log('Setting up global chat listener');
  if (globalListener) return globalListener;
  console.log('Global chat listener not set up, setting up now');

  globalListener = db.listen(`user_messages`, async (payload) => {
    console.log('New chat message received:', payload);
    const userId = JSON.parse(payload).sender;
    const chatID = JSON.parse(payload).chat_id;
    const reciver = await getReciverID(chatID, userId);
    const listener = activeListeners.get(reciver);
    const listener2 = activeListeners.get(userId);
    const receiverUser = await getUsernameById(reciver);
    const senderUser = await getUsernameById(userId);
    const parsedPayload = JSON.parse(payload);
    delete parsedPayload.sender;
    const payload2 = {
          ...parsedPayload,
          receiver: receiverUser,
          sender: senderUser,
        };

    if (listener) {
      const encoder = new TextEncoder();
      listener.controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(payload2)}\n\n`)
      );
    }
    if (listener2) {
      const encoder = new TextEncoder();
      listener2.controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(payload2)}\n\n`)
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