import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { updateEmail } from '$lib/server/users';
import { generateUserId, sendVerificationEmail } from '$lib/helpers/user';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	changeEmail: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/');
		}
		try {
			await updateEmail(event.locals.user.email, event);
			return { status: 200, message: 'Email changed successfully' };
		} catch (error) {
			return fail(401, { message: 'Unexpected' + error });
		}
	},
	verifyEmail: async (event) => {
		const user = event.locals.user ? event.locals.user : null;
		if (user === null) return redirect(302, '/');
		const verify_id = generateUserId();
		if (user.email === null) return fail(401, { message: 'Email error' });
		try {
			sendVerificationEmail(user.email as string, verify_id);
			await db`
                INSERT INTO verification (verify_id, user_id)
                VALUES (${verify_id}, ${user.userId})
            `;
		} catch (error) {
			return fail(401, { message: error instanceof Error ? error.message : String(error) });
		}
		return { status: 201, message: 'Verification email sent' };
	}
};
