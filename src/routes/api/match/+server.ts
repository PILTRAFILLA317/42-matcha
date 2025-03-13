import type { RequestHandler } from './$types';
import { checkMatchNoNotification } from '$lib/server/utils';
import { getIdByUsername } from '$lib/server/utils';

export const POST = async ({ request, locals }) => {
    try {
        const body = await request.json();
        const username = body.username;
        const userId = await getIdByUsername(username);
        const registeredUser = locals.user;
        const result = await checkMatchNoNotification(registeredUser?.userId,  userId[0].id);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};