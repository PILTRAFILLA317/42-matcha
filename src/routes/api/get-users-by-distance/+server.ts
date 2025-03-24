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

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return Math.round(distance);
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
    const body = await request.json();
    const userAmount = body.userAmount;

    const location = locals.user?.location;
    if (!location) {
        return new Response('Location not available', { status: 400 });
    }

    const latitude = location[0];
    const longitude = location[1];

    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const allUsers = await db`
        SELECT *
        FROM users
        WHERE id != ${userId}
        AND location IS NOT NULL
        `;

        const users = allUsers
            .map(user => {
                const [userLat, userLng] = user.location;
                const distance = getDistance(latitude, longitude, userLat, userLng);
                return { ...user, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, userAmount);

        const usersWithoutId = users.map(user => {
            const { id, ...userWithoutId } = user;
            return userWithoutId;
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