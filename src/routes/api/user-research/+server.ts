import type { RequestHandler } from './$types';
import { error, fail } from '@sveltejs/kit';
import { userResearch } from '$lib/server/utils';

export const POST = async ({ request }) => {
    try {
        const { minAge, maxAge, minFR, maxFR, distance, tags, currentUser } = await request.json();
        const users = await userResearch(minAge, maxAge, minFR, maxFR, distance, tags, currentUser);

        return new Response(JSON.stringify(users), {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    // catch (err) {
    //     return new Response(JSON.stringify({ error: (err as Error).message }), {
    //         status: 500,
    //         headers: {
    //             'content-type': 'application/json'
    //         }
    //     });
    // }
    catch (err) {
        return error(500, err.message);
    }
};