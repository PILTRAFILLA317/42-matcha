import type { PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { hash } from '@node-rs/argon2';
import { generateUserId, sendVerificationEmail } from '$lib/helpers/user';
import { db } from '$lib/server/db';
import {
	validateUsername,
	validateName,
	validatePassword,
	validateEmail
} from '$lib/helpers/validators';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const username = formData.get('username');
		const firstname = formData.get('firstname');
		const lastname = formData.get('lastname');
		const password = formData.get('password');
		const repeatpassword = formData.get('repeatpassword');
		console.log('Registering user', {
			email,
			username,
			firstname,
			lastname,
			password,
			repeatpassword
		});

		if (!email) return fail(400, { message: 'Email missing' });
		if (!username) return fail(400, { message: 'Username missing' });
		if (!firstname) return fail(400, { message: 'First name missing' });
		if (!lastname) return fail(400, { message: 'Last name missing' });
		if (!password) return fail(400, { message: 'Password missing' });
		if (!repeatpassword) return fail(400, { message: 'Repeat password missing' });
		if (password !== repeatpassword) return fail(400, { message: 'Passwords do not match' });

		if (!validateEmail(email)) return fail(400, { message: 'Invalid email' });
		if (!validateUsername(username)) return fail(400, { message: 'Invalid username' });
		if (!validateName(firstname as string)) return fail(400, { message: 'Invalid first name' });
		if (!validateName(lastname as string)) return fail(400, { message: 'Invalid first name' });
		if (!validatePassword(password as string)) return fail(400, { message: 'Invalid password' });

		const userId = generateUserId();
		if (typeof password !== 'string') {
			return fail(400, { message: 'Invalid password' });
		}
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db`
				INSERT INTO users (id, email, username, password, first_name, last_name)
				VALUES (${userId}, ${String(email)}, ${String(username)}, ${String(passwordHash)}, ${String(firstname)}, ${String(lastname)})
				ON CONFLICT (id) DO NOTHING
			`;
			const sessionToken = auth.generateSessionToken();
			const session: Session = await auth.createSession(sessionToken, userId);

			await db`
				INSERT INTO sessions (id, user_id, expires_at)
				VALUES (${sessionToken}, ${userId}, ${session.expiresAt.toISOString()})
			`;
			const verify_id = generateUserId();
			if (email === null) return fail(401, { message: 'Email is required' });
			sendVerificationEmail(
				verify_id,
				email as string,
				{
					userId: userId,
					email: email as string,
					username: username as string,
					firstName: firstname as string,
					lastName: lastname as string
				} as User
			);
			await db`
				INSERT INTO verification (verify_id, user_id)
				VALUES (${verify_id}, ${userId})
			`;
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			if (error.constraint_name === 'users_email_key')
				return fail(400, { message: 'Email already in use' });
			if (error.constraint_name === 'users_username_key')
				return fail(400, { message: 'Username already in use' });
			return fail(400, { message: 'Unexpected error' });
		}
		return redirect(302, '/');
	}
};
