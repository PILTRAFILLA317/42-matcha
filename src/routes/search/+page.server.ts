import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	//const {locals} = event; ionmi explicando Destructuring assignment
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	if (!event.locals.user.verified) {
		return redirect(302, '/verify');
	}
	if (!event.locals.user.completed) {
		return redirect(302, '/complete-profile');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/auth/login');
	}
};
