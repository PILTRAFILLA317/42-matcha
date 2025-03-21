import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/');
    }
    if (!event.locals.user.completed) {
		return redirect(302, '/complete-profile');
	}
    return {user : event.locals.user};
};