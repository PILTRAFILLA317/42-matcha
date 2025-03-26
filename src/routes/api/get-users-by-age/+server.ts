import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

async function usersIdtoUsername(users) {
    const usersWithUsername = [];
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

function filterByPreference(users: User[], user: User): User[] {
    const userPreference = user.sexualPreferences;
    const userGender = user.gender;
    if (userGender === true && userPreference === 'Heterosexual') {
        users = users.filter(
            (u: User) => u.gender === false && (u.sexual_preferences === 'Heterosexual' || u.sexual_preferences === 'Bisexual')
        );
    } else if (userGender === true && userPreference === 'Homosexual') {
        users = users.filter(
            (u: User) => u.gender === true && (u.sexual_preferences === 'Homosexual' || u.sexual_preferences === 'Bisexual')
        );
    } else if (userGender === true && userPreference === 'Bisexual') {
        users = users.filter(
            (u: User) =>
                (u.gender === false && (u.sexual_preferences === 'Heterosexual' || u.sexual_preferences === 'Bisexual')) ||
                (u.gender === true && (u.sexual_preferences === 'Homosexual' || u.sexual_preferences === 'Bisexual'))
        );
    } else if (userGender === false && userPreference === 'Heterosexual') {
        users = users.filter(
            (u: User) => u.gender === true && (u.sexual_preferences === 'Heterosexual' || u.sexual_preferences === 'Bisexual')
        );
    } else if (userGender === false && userPreference === 'Homosexual') {
        users = users.filter(
            (u: User) => u.gender === false && (u.sexual_preferences === 'Homosexual' || u.sexual_preferences === 'Bisexual')
        );
    } else if (userGender === false && userPreference === 'Bisexual') {
        users = users.filter(
            (u: User) =>
                (u.gender === true && (u.sexual_preferences === 'Heterosexual' || u.sexual_preferences === 'Bisexual')) ||
                (u.gender === false && (u.sexual_preferences === 'Homosexual' || u.sexual_preferences === 'Bisexual'))
        );
    }
    return users;
}

export const POST = async ({ request, locals }) => {
    const userId = locals.user?.userId;

    try {
        const body = await request.json();
        const userAmount = body.userAmount;
        if (!userId) {
            return new Response('User ID is missing', { status: 400 });
        }

        const users = await db`
        SELECT *
        FROM users
        WHERE id != ${userId}
        AND age IS NOT NULL
        AND completed = true
        AND verified = true
        ORDER BY age DESC
        LIMIT ${userAmount}
        `;

        const usersWithoutId = users.map(user => {
            const { id, ...rest } = user;
            return rest;
        });
        const filteredUsers = await removeBlockedUsers(usersWithoutId, locals);
        const filteredUsersByPreference = filterByPreference(filteredUsers, locals.user);
        return new Response(JSON.stringify(filteredUsersByPreference), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response('Internal Server Error', { status: 500 });
    }
};