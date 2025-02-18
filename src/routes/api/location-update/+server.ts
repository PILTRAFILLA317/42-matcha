import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
    try {
        console.log('request', request);


    } catch (error) {
        return json({ error: 'Error liking user' }, { status: 500 });
    }
};
