import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAllTags } from '$lib/server/utils';

export const GET = async () => {
    try {
        const tags = await getAllTags();
        // console.log('tags', tags);
        return json(tags);
    } catch (error) {
        // console.log(error);
        return json({ error: 'Error fetching tags' }, { status: 500 });
    }
}