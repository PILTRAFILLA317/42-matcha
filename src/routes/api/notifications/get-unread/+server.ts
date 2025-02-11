import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// export const GET: RequestHandler = async () => {
//     return new Response();
// };

export async function GET({ url }) {

    try {
        const userId = url.searchParams.get('userId');

        const notifications = await db`
        SELECT * FROM notifications
        WHERE user_id = ${userId}
        AND read = false
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