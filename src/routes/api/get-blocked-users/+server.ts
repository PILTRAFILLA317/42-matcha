import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export const GET = async ({ locals }) => {
    try {
        if (!locals.user?.userId) {
            throw new Error('User ID is undefined');
        }
        const blockedUsers = await db`
            SELECT blocked_users
            FROM users
            WHERE id = ${locals.user.userId}
        `;
        const blockedUsersIds = blockedUsers[0].blocked_users;
        if (blockedUsersIds === null) {
            return new Response(JSON.stringify({ blockedUsers: [] }), { status: 200 });
        }
        const blockedUsersData = await db`
            SELECT username, profile_pictures
            FROM users
            WHERE id = ANY(${blockedUsersIds})
        `;
        const blockedUsernames = blockedUsersData.map(user => ({
            username: user.username,
            profilePicture: Array.isArray(user.profile_pictures) && user.profile_pictures.length > 0 ? user.profile_pictures[0] : null
        }));
        return new Response(JSON.stringify({ blockedUsers: blockedUsernames }), { status: 200 });
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        return new Response(JSON.stringify({ error: 'Error fetching blocked users' }), { status: 500 });
    }
};