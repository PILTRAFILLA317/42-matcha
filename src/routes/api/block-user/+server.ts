import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { checkUserLikes, addLikedUser, removeLikedUser } from '$lib/server/utils';
import { db } from '$lib/server/db';

export const POST = async ({ request, locals }) => {
    try {
        // console.log('request', request);
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
                console.log('User already blocked');
                await db`
                UPDATE users
                SET blocked_users = array_remove(blocked_users, ${blockedUserId[0].id})
                WHERE id = ${locals.user.userId}
                `;
                console.log('User unblocked');
                return json({ message: 'User unblocked successfully' }, { status: 200 });
            }
        }
        await db`
        UPDATE users
        SET blocked_users = array_append(blocked_users, ${blockedUserId[0].id})
        WHERE id = ${locals.user.userId}
        `;
        if (await checkUserLikes(locals.user.userId, blockedUser)) {
            await removeLikedUser(locals.user.userId, blockedUser);
        }

    } catch (error) {
        console.error('Error blocking user:', error);
        return json({ error: 'Error blocking user' }, { status: 500 });
    }
    return json({ message: 'User blocked successfully' }, { status: 200 });
};