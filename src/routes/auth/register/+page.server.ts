import type { PageServerLoad } from './$types';
import * as validators from '$lib/helpers/validators';
import * as auth from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { validateUsername } from '$lib/helpers/validators';
import { hash } from '@node-rs/argon2';
import { generateUserId } from '$lib/helpers/user';
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

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validators.validatePasswords(password, repeatpassword)) {
			return fail(400, { message: 'Invalid password' });
		}
		//To-do validar el resto de campos
		const userId = generateUserId();
		if (typeof password !== 'string') {
			//return fail(400, { message: 'Invalid password' });
			alert('Invalid password');
			throw new Error('Invalid password');
		}
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			console.log('Inserting user', { id: userId, username, passwordHash });

			// Insertar usuario en la base de datos
			await db`
				INSERT INTO users (id, email, username, password, first_name, last_name)
				VALUES (${userId}, ${String(email)}, ${String(username)}, ${String(passwordHash)}, ${String(firstname)}, ${String(lastname)})
				ON CONFLICT (id) DO NOTHING
			`;

			// Crear sesión
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);

			// Guardar la sesión en la base de datos
			await db`
				INSERT INTO sessions (id, user_id, expires_at)
				VALUES (${sessionToken}, ${userId}, ${session.expiresAt.toISOString()})
			`;

			// Configurar la cookie de sesión
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('Error inserting user:', error);
		}

		return redirect(302, '/');
	}
};
