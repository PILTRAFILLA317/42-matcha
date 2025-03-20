import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export const POST = async ({ request, locals }) => {
    try {
        const body = await request.json();
        const userId = locals.user?.userId;
        const username = locals.user?.username;
        const reportedUsername = body.reportedUserUsername;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        if (username === reportedUsername) {
            return new Response(JSON.stringify({ error: 'You cannot report yourself' }), { status: 400 });
        }

        if (!username || !reportedUsername) {
            return new Response(JSON.stringify({ error: 'Invalid data provided' }), { status: 400 });
        }

        await db`
            INSERT INTO reports (reporter, reported_user)
            VALUES (${username}, ${reportedUsername})
        `;

        return new Response(JSON.stringify({ message: 'Report submitted successfully' }), { status: 200 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};