import type { RequestHandler } from './$types';
import { checkMatchNoNotification } from '$lib/server/utils';
import { getIdByUsername } from '$lib/server/utils';

export const POST = async ({ request, locals }) => {
    try {
        const body = await request.json();
        console.log("body: ", body);
        const username = body.username;
        const userId = await getIdByUsername(username);
        const registeredUser = locals.user;
        console.log("userId: ", userId[0].id);
        console.log("registeredUser: ", registeredUser);
        const result = await checkMatchNoNotification(registeredUser?.userId,  userId[0].id);
        console.log("capoplaza: ", result);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};