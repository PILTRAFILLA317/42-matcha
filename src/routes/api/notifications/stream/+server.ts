// src/routes/api/sse/+server.ts
import postgres from 'postgres';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
import { db } from '$lib/server/db';

// Track active connections
const activeConnections = new Set<postgres.Sql>();

export const GET: RequestHandler = async ({ locals }) => {
  // const sql = postgres(env.DATABASE_URL, {
  //   ssl: 'require',
  //   max: 1,
  //   connect_timeout: 20,
  //   idle_timeout: 60
  // });

  activeConnections.add(db);
  if (dev) console.log('Active connections:', activeConnections.size);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let unsubscribe: () => Promise<void>;

      try {
        const userId = locals.user?.userId;
        controller.enqueue(encoder.encode('data: connected\n\n'));
        unsubscribe = db.listen(`user_notifications_${userId}`, (payload) => {
          console.log('Sending payload:', payload);
          controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`);
        }
        );

        // HMR cleanup
        if (import.meta.hot) {
          import.meta.hot.dispose(async () => {
            console.log('Disposing SSE connection');
            unsubscribe?.();
            activeConnections.delete(db);
            // await db.end();
          });
        }
      } catch (err) {
        console.error('SSE Error:', err);
        controller.close();
      }

      return async () => {
        unsubscribe?.();
        activeConnections.delete(db);
        // await db.end();
      };
    },
    cancel() {
      activeConnections.delete(db);
      // db.end().catch(() => { });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  });
};
