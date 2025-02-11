import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export async function GET({ url }) {

    try {
        const userId = url.searchParams.get('userId');

        const notifications = await db`
        SELECT * FROM notifications
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;

        // console.log('notifications:', notifications);

        const json = JSON.stringify(notifications);

        return new Response(json, {
            headers: {
                'content-type': 'application/json'
            }
        });

    } catch (error) {
        console.error(error);
        return new Response('Internal server error', { status: 500 });
    }
}