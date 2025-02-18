import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { checkUserLikes, addLikedUser, removeLikedUser } from '$lib/server/utils';

export const POST = async ({ request, locals }) => {
    try {
        // console.log('request', request);
        const body = await request.json();
        const userIsLiked = await checkUserLikes(locals.user?.userId, body.likedUserUsername);
        console.log('body', body);
        console.log('userIsLiked', userIsLiked);
        if (userIsLiked) {
            await removeLikedUser(locals.user?.userId, body.likedUserUsername);
            return json({ message: 'User unliked successfully' }, { status: 200 });
        } else {
            console.log('adding liked user');
            await addLikedUser(locals.user?.userId, body.likedUserUsername);
            return json({ message: 'User liked successfully' }, { status: 200 });
        }
        // return json({ message: 'User liked successfully' }, { status: 200 });
        
    } catch (error) {
        return json({ error: 'Error likeing user' }, { status: 500 });
    }
};