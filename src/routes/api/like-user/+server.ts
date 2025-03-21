import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { checkUserLikes, addLikedUser, removeLikedUser } from '$lib/server/utils';

export const POST = async ({ request, locals }) => {
    try {
        const body = await request.json();
        if (!locals.user?.userId) {
            throw new Error('User ID is undefined');
        }
        const userIsLiked = await checkUserLikes(locals.user.userId, body.likedUserUsername);
        if (userIsLiked) {
            if (locals.user?.userId) {
                await removeLikedUser(locals.user.userId, body.likedUserUsername);
            } else {
                throw new Error('User ID is undefined');
            }
            return json({ message: 'User unliked successfully' }, { status: 200 });
        } else {
            if (locals.user?.userId) {
                await addLikedUser(locals.user.userId, body.likedUserUsername);
            } else {
                throw new Error('User ID is undefined');
            }
            return json({ message: 'User liked successfully' }, { status: 200 });
        }
        // return json({ message: 'User liked successfully' }, { status: 200 });
        
    } catch (error) {
        return json({ error: 'Error likeing user' }, { status: 500 });
    }
};