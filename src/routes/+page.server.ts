import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { generateUserId, sendVerificationEmail } from '$lib/helpers/user';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	//const {locals} = event; ionmi explicando Destructuring assignment
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
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
	},
	email: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}
		const verify_id = generateUserId();
		try {
			await db`
				INSERT INTO verification (verify_id, user_id)
				VALUES (${verify_id}, ${event.locals.user.userId})
			`;
			sendVerificationEmail(verify_id, event.locals.user.email, event.locals.user);
		} catch (e) {
			return fail(500);
		}
	}
};
