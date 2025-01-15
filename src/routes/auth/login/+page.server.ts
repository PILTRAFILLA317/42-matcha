import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		console.log('Login', { email, password });
		if (!validateEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		// const results = await db.select().from(table.user).where(eq(table.user.username, username));

		const [existingUser] = await db`SELECT * FROM public.users WHERE email = ${String(email)}`;
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		console.log('Existing user', existingUser);
		const validPassword = await verify(existingUser.hashed_password, String(password), {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const email = formData.get('email');
		const firstname = formData.get('firstname');
		const lastname = formData.get('lastname');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			console.log('Inserting user', { id: userId, username, passwordHash });

			// Insertar usuario en la base de datos
			await db`
				INSERT INTO users (id, email, username, hashed_password, first_name, last_name)
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

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	// const bytes = crypto.getRandomValues(new Uint8Array(15));
	// const id = encodeBase32LowerCase(bytes);
	const id = uuidv4();
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

function validateEmail(email: unknown): email is string {
	return typeof email === 'string' && email.length >= 3 && email.length <= 255;
}
