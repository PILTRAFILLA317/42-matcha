import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export async function POST({ request }) {

    try {
        const requestJson = await request.json();
        const userId = requestJson.userId;
        
        if (!userId) {
            return new Response('User ID is required', { status: 400 });
        }

        const lastVisits = await db`
            SELECT last_visits
            FROM users
            WHERE id = ${userId}
        `;

        for (let i = 0; i < lastVisits[0].last_visits.length; i++) {
            const userId = lastVisits[0].last_visits[i];
            const user = await db`
                SELECT username
                FROM users
                WHERE id = ${userId}
            `;
            lastVisits[0].last_visits[i] = user[0].username;
        }

        let limitedUsers = [];
        const lastVisitedUsernames = lastVisits[0].last_visits;
        const limitedUsernames = lastVisitedUsernames.slice(-10);
        for (let i = 0; i < limitedUsernames.length; i++) {
            const user = await db`
                SELECT profile_pictures
                FROM users
                WHERE username = ${limitedUsernames[i]}
            `;
            limitedUsers.push({
                username: limitedUsernames[i],
                profilePicture: user[0]?.profile_pictures?.[0] || null
            });
        }
        return new Response(JSON.stringify(limitedUsers), {
            headers: {
            'content-type': 'application/json'
            }
        });

    } catch (error) {
        return new Response('Internal server error', { status: 500 });
    }
}