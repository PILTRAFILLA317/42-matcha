import type { RequestHandler } from './$types';
import { checkUserLikes } from '$lib/server/utils';
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
    try {
        const body = await request.json();
        if (!locals.user?.userId) {
            throw new Error('User ID is undefined');
        }
        const blockedUser = body.blockedUserUsername;
        const blockedUserId = await db`
                SELECT id
                FROM users
                WHERE username = ${blockedUser}
                `;
        if (blockedUserId.length === 0) {
            return json({ error: 'User not found' }, { status: 404 });
        }
        const blockedUsers = await db`
                SELECT blocked_users
                FROM users
                WHERE id = ${locals.user.userId}
                `;
        if (blockedUsers[0].blocked_users !== null) {
            if (blockedUsers[0].blocked_users.includes(blockedUserId[0].id)) {
                return new Response(JSON.stringify({ message: true }), { status: 200 });
            }
            return new Response(JSON.stringify({ message: false }), { status: 200 });
        }
        return new Response(JSON.stringify({ message: false }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};