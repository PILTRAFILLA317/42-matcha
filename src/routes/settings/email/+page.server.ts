import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { updateEmail } from '$lib/server/users';
import { generateUserId, sendVerificationEmail } from '$lib/helpers/user';
import { verify } from '@node-rs/argon2';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	if (!event.locals.user.completed) {
		return redirect(302, '/complete-profile');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	changeEmail: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/');
		}
		try {
			const formData = await event.request.formData();
			const email = formData.get('email');
			if (email as string === event.locals.user.email)
				return fail(401, { message: 'Email is the same' });
			await updateEmail(email as string, event);
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
			await db`
			INSERT INTO verification (verify_id, user_id)
			VALUES (${verify_id}, ${user.userId})
            `;
			sendVerificationEmail(verify_id, user.email, user);
		} catch (error) {
			return fail(401, { message: error instanceof Error ? error.message : String(error) });
		}
		return { status: 201, message: 'Verification email sent' };
	},
};
