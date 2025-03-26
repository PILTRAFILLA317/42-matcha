import * as auth from '$lib/server/auth';
import * as users from '$lib/server/users';
// import {getUser} from '$lib/server/users';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/auth/login');
    }
    if (!event.locals.user.verified) {
		return redirect(302, '/verify');
	}
    if (!event.locals.user.completed) {
		return redirect(302, '/complete-profile');
	}
    const currentUser = await users.getUser(String(event.params.user));
    if (!currentUser)
        return {user: event.locals.user};
    return { user: event.locals.user, currentUser, session: event.locals.session};
};