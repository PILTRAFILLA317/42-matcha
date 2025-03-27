import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load:  PageServerLoad  = async ({locals}) => {
    
    return {user: locals.user};
}

export const actions: Actions = {
    changeLocation: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get('name');
        const lat = formData.get('lat');
        const long = formData.get('long');
        if (!name || !lat || !long) {
            return;
        }
        if (Number(lat) === 0 && Number(long) === 0) {
            return;
        }
        await event.fetch('/api/location-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: event.locals.user?.username, latitude:lat, longitude:long }),
        });
        await db`
            UPDATE users
            SET manual_location = true
            WHERE username = ${event.locals.user?.username}
        `;
        return {status: 200};
    },
    activateLocation: async (event) => {
        await db`
            UPDATE users
            SET manual_location = false
            WHERE username = ${event.locals.user?.username}
        `;
        return {status: 200};
    }
};