import { validateEmail } from '$lib/helpers/validators';
import { db } from '$lib/server/db'; // Assuming you have a db module for database connection

export async function updateEmail(newEmail: string, user: User) {
	if (!user) throw new Error('User not found');
	const username: string = user.username;
	console.log('updating user\nUserID is => ', username, '\nNew email is => ', newEmail);
	if (!validateEmail(newEmail)) throw new Error('Invalid email');
	try {
		await db`UPDATE users
            SET email = ${newEmail} WHERE username = ${username};
            `;
		console.log('Email updated');
	} catch (error) {
		console.error('Fuck my ass', error);
		throw new Error('Error updating email');
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