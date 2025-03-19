import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

async function usersIdtoUsername(users) {
    const usersWithUsername = [];
    console.log('usersIdtoUsername USERS', users);
    for (let i = 0; i < users.length; i++) {
        const userId = users[i];
        const user = await db`
            SELECT username
            FROM users
            WHERE id = ${userId}
        `;
        users[i] = user[0].username;
        usersWithUsername.push(user[0].username);
    }
    return usersWithUsername;
}

async function removeBlockedUsers(users, locals) {
    const blockedUsers = await db`
    SELECT blocked_users
    FROM users
    WHERE id = ${locals.user.userId}
`;
    const blockedUsersIds = blockedUsers[0].blocked_users;
    if (blockedUsersIds !== null) {
        const usersWithUsername = await usersIdtoUsername(blockedUsersIds);
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (usersWithUsername.includes(user.username)) {
                users.splice(i, 1);
                i--;
            }
        }
    }
    return users;
}

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
        AND age IS NOT NULL
        ORDER BY age DESC
        LIMIT ${userAmount}
        `;

        const usersWithoutId = users.map(user => {
            const { id, ...rest } = user;
            return rest;
        });
        const filteredUsers = await removeBlockedUsers(usersWithoutId, locals);
        console.log('filteredUsers', filteredUsers);
        // console.log('usersWithoutId', usersWithoutId);
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