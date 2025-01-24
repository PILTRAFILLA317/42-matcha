import { validateEmail } from '$lib/helpers/validators';
import { db } from '$lib/server/db'; // Assuming you have a db module for database connection
import { hash, verify } from '@node-rs/argon2';
import type { RequestEvent } from '@sveltejs/kit';

/*
	The code here is really ugly Is really ugly
	I use the a really similar function each time
	I cannot be bothered though

	TO-DO=>
	- Add data validation for each input
*/

export async function updateEmail(
	newEmail: string,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	if (!validateEmail(newEmail)) throw new Error('Invalid email');
	try {
		await db`UPDATE users
            SET email = ${newEmail} WHERE username = ${user.username}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
		console.log('Email updated');
	} catch (error) {
		throw new Error('Error updating email');
	}
}

export async function updateUsername(
	newUsername: string,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	try {
		await db`UPDATE users
            SET username = ${newUsername} WHERE id = ${user.userId}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
		console.log('Email updated');
	} catch (error) {
		throw new Error('Error updating username');
	}
}

export async function updateFirstName(
	newFirstName: string,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	try {
		await db`UPDATE users
            SET first_name = ${newFirstName} WHERE id = ${user.userId}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
		console.log('Email updated');
	} catch (error) {
		throw new Error('Error updating first_name');
	}
}

export async function updateLastName(
	newLastName: string,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	try {
		await db`UPDATE users
            SET last_name = ${newLastName} WHERE id = ${user.userId}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
		console.log('Email updated');
	} catch (error) {
		throw new Error('Error updating second_name');
	}
}

export async function updateGender(
	gender: boolean,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	console.log('trying to update gender to =>', gender);
	try {
		const res = await db`UPDATE users
            SET gender = ${gender} WHERE id = ${user.userId}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
		console.log('gender updated. Response ->\n', res);
	} catch (error) {
		throw new Error('Error updating gender');
	}
}

export async function updateSexualPreference(
	preference: string,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	try {
		await db`UPDATE users
            SET sexual_preferences = ${preference} WHERE id = ${user.userId}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
	} catch (error) {
		console.log(error);
		throw new Error('Error updating sexual preference');
	}
}

export async function updateBio(
	bio: string | null,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	try {
		await db`UPDATE users
            SET bio = ${bio} WHERE id = ${user.userId}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
		console.log('Email updated');
	} catch (error) {
		throw new Error('Error updating second_name');
	}
}

export async function updatePassword(
	password: string,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	try {
		await db`UPDATE users
		SET password = ${password} WHERE id = ${user.userId}
		AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
		`;
	} catch (error) {
		throw new Error('Error updating second_name');
	}
}

export async function checkPassword(
	password: string,
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;
	if (!user) throw new Error('User not found');
	if (!session) throw new Error('Session not found');
	try {
		const [dbUser] = await db`SELECT password FROM users WHERE id = ${user.userId}`;
		if (!dbUser) throw new Error('User does not exist in the database');
		const storedPasswordHash = dbUser.password;
		const isPasswordCorrect = await verify(storedPasswordHash, password);
		if (!isPasswordCorrect) {
			throw new Error('Password is incorrect');
		}
	} catch (error) {
		throw new Error('Password is incorrect');
	}
}
