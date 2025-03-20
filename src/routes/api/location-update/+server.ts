import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { updateUserLocation } from '$lib/server/users';

export const POST = async ({ request, locals }) => {
    try {
        const body = await request.json();
        if (locals.user?.username) {
            updateUserLocation(locals.user.username, body.latitude, body.longitude);
        } else {
            throw new Error('Username is required');
        }
    } catch (error) {
        return json({ error: 'Error updating location' }, { status: 500 });
    }
    return json({ message: 'Location updated successfully' }, { status: 200 });
};
