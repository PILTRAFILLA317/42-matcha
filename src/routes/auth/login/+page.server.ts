import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

import { validateEmail, validatePassword, validateUsername } from '$lib/helpers/validators';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		console.log('Login: ', { username, password });

		if (!username || !password) {
			return fail(400, { message: 'Username or password missing' });
		}
		const [existingUser] =
			await db`SELECT * FROM public.users WHERE username = ${String(username)}`;
		console.log('existingUser: ', existingUser);
		if (!existingUser) {
			return fail(401, { message: 'Incorrect username' });
		}
		const validPassword = await verify(existingUser.password, String(password), {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(401, { message: 'Incorrect password' });
		}
		console.log('semen');

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	}
};
