import type { PageServerLoad } from './$types';
import * as validators from '$lib/helpers/validators';
import * as auth from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { validateUsername } from '$lib/helpers/validators';
import { hash } from '@node-rs/argon2';
import { generateUserId, sendVerificationEmail } from '$lib/helpers/user';
import { db } from '$lib/server/db';

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
		if (!email) {
			return fail(400, { message: 'Email missing' });
		}
		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validators.validatePasswords(password, repeatpassword)) {
			return fail(400, { message: 'Invalid password' });
		}
		//To-do validar el resto de campos
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
			// Insertar usuario en la base de datos
			await db`
				INSERT INTO users (id, email, username, password, first_name, last_name)
				VALUES (${userId}, ${String(email)}, ${String(username)}, ${String(passwordHash)}, ${String(firstname)}, ${String(lastname)})
				ON CONFLICT (id) DO NOTHING
			`;
			// Crear sesión
			const sessionToken = auth.generateSessionToken();
			const session: Session = await auth.createSession(sessionToken, userId);

			// Guardar la sesión en la base de datos
			await db`
				INSERT INTO sessions (id, user_id, expires_at)
				VALUES (${sessionToken}, ${userId}, ${session.expiresAt.toISOString()})
			`;
			const verify_id = generateUserId();
			if (email === null) return fail(401, { message: 'Email is required' });
			sendVerificationEmail(email as string, verify_id);
			await db`
				INSERT INTO verification (verify_id, user_id)
				VALUES (${verify_id}, ${userId})
			`;

			// Configurar la cookie de sesión
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			// return ({ status: 201, message: 'User registered' });
		} catch (error) {
			console.error('Error inserting user:', error);
			return fail(400, { message: 'Unexpected error' });
		}
		return redirect(302, '/');
	}
};
