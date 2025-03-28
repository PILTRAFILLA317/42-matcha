import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
		return redirect(302, '/');
	}
	if (!locals.user.verified) {
		return redirect(302, '/verify');
	}
	if (!locals.user.completed) {
		return redirect(302, '/complete-profile');
	}
	return { user: locals.user };
};

export const actions: Actions = {
	changeLocation: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name');
		const lat = formData.get('lat');
		const long = formData.get('long');
        if (!event.locals.user){
            return fail(401, { message: 'Unauthorized' });
        }
		if (!name || !lat || !long) {
			return fail(400, { message: 'Missing required fields' });
		}
		if (Number(lat) === 0 && Number(long) === 0) {
            return fail(400, { message: 'Missing required fields' });
		}
        try{
            await event.fetch('/api/location-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: event.locals.user?.username,
                    latitude: lat,
                    longitude: long
                })
            });
            await db`
            UPDATE users
            SET manual_location = true
            WHERE username = ${event.locals.user?.username}
            `;
            } catch (e) {
                return fail(400, { message: 'Unexpected Error Updating Location' });
            }
		return { status: 200, message: 'Location updated to ' + name };
	},
	activateLocation: async (event) => {
        if (!event.locals.user){
            return fail(401, { message: 'Unauthorized' });
        }
        try{
            await db`
            UPDATE users
            SET manual_location = false
            WHERE username = ${event.locals.user?.username}
            `;
        } catch (e) {
            return fail(400, { message: 'Unexpected Error Activating Location' });
        }
		return { status: 200, message: 'Automatic Location Activated' };
	}
};
