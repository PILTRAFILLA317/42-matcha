import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { updateUserLocation } from '$lib/server/users';

export const POST = async ({ request, locals }) => {
    try {
        console.log('request', request);
        const { latitude, longitude } = await request.json();
        if (!latitude || !longitude) {
            return json({ error: 'Missing latitude or longitude' }, { status: 400 });
        }
        if (!locals.user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }
        await updateUserLocation(locals.user.username, latitude, longitude);
        return json({ message: 'Location updated' });
    } catch (error) {
        return json({ error: 'Error updating location' }, { status: 500 });
    }
};
