import {
	usernameExists,
	validateBio,
	validateEmail,
	validateName,
	validateSexualPreference,
	validateUsername
} from '$lib/helpers/validators';
import { db } from '$lib/server/db'; // Assuming you have a db module for database connection
import { hash, verify } from '@node-rs/argon2';
import { fail, json, type RequestEvent } from '@sveltejs/kit';

export async function getUser(username: string): Promise<User | null> {
    const [user] = await db`SELECT * FROM users WHERE username = ${username}`;
    if (!user) { return null; }
    const selectedUser = {
        userId: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        gender: user.gender,
        sexualPreferences: user.sexual_preferences,
        totalLikes: user.total_likes,
        userPreferences: user.user_preferences,
        location: user.location,
        bio: user.bio,
		age: user.age,
		verified: user.verified,
    };
    return selectedUser;
}

export async function updateUserLocation(username: string, latitude: number, longitude: number) {
    if (!username) throw new Error('Username is required');
    try {
        await db`UPDATE users
            SET location = ARRAY[${latitude}, ${longitude}]::float[] WHERE username = ${username};
            `;
        console.log('Location updated');
    } catch (error) {
        console.error('Error updating location', error);
        throw new Error('Error updating location');
    }
}

// export async function updateUsername(newUsername: string, user: User) {
// 	if (!user) throw new Error('User not found');
// 	const username: string = user.username;
// 	console.log('updating user\nUserID is => ', username, '\nNew email is => ', newUsername);
// 	if (!validateEmail(newUsername)) throw new Error('Invalid email');
// 	try {
// 		await db`UPDATE users
//             SET username = ${newUsername} WHERE username = ${username};
//             `;
// 		console.log('Email updated');
// 	} catch (error) {
// 		console.error('Fuck my ass', error);
// 		throw new Error('Error updating email');
// 	}
// }


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
	if (!validateUsername(newUsername)) throw new Error('Username lenght 3-31 & Alphanumnerical');
	if (await usernameExists(newUsername, user.userId)) throw new Error('Username already taken');
	try {
		await db`UPDATE users
            SET username = ${newUsername} WHERE id = ${user.userId}
			AND EXISTS (SELECT 1 FROM sessions WHERE id = ${session.id} AND user_id = ${user.userId});
            `;
		console.log('Username updated');
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
	if (!validateName(newFirstName)) throw new Error('Invalid first name, just Alphabetical');
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
	if (!validateName(newLastName)) throw new Error('Invalid last name, just Alphabetical');
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
	if (!validateSexualPreference(preference)) throw new Error('Invalid sexual preference');
	console.log('preference: ', preference);
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
	if (!validateBio(bio as string)) throw new Error('Invalid bio');
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

export async function updatePasswordRecover(password: string, recoverId: string) {
	if (!password) throw new Error('Password is required');
	if (!recoverId) throw new Error('Recovery id is required');
	try {
		const whatever = await db`SELECT user_id
		FROM password_recovery WHERE id = ${recoverId}`;
		const result = await db`UPDATE users
		SET password = ${password} WHERE id = ${whatever[0].user_id}
		`;
		console.log('result: ', result);
		if (!result) {
			return fail(401, { message: 'Error sending email' });
		}
		const res = await db`DELETE FROM password_recovery WHERE id = ${recoverId}`;
		console.log('res: ', res);
		if (!res){
			return fail(401, { message: 'Error deleting verifyID' });
		}
		return {success: true, status: 201, message: "Password changed successfully"};
	} catch (error) {
		console.log('error: ', error);
		return fail(401, { message: 'Unexpected error' });
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
