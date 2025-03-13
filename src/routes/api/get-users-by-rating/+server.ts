import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';


export const POST = async ({ request, locals }) => {
    const userId = locals.user?.userId;

    try {
        const body = await request.json();
        const userAmount = body.userAmount;
        console.log('body', body);
        if (!userId) {
            return new Response('User ID is missing', { status: 400 });
        }

        const users = await db`
        SELECT *
        FROM users
        WHERE id != ${userId}
        AND total_likes IS NOT NULL
        ORDER BY total_likes DESC
        LIMIT ${userAmount}
        `;

        // return new Response(JSON.stringify(users), {
        //     status: 200,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        const usersWithoutId = users.map(user => {
            const { id, ...rest } = user;
            return rest;
        });

        console.log('usersWithoutId', usersWithoutId);
        return new Response(JSON.stringify(usersWithoutId), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error getting users:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};