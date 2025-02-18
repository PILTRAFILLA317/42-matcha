import type { RequestHandler } from './$types';
import { checkUserLikes } from '$lib/server/utils';

export const POST = async ({ request, locals }) => {
    try {
        const body = await request.json();
        const userId = body.likedUserUsername;
        const registeredUser = locals.user;
        const result = await checkUserLikes(registeredUser?.userId, userId);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};