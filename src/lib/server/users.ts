import { validateEmail } from '$lib/helpers/validators';
import { db } from '$lib/server/db'; // Assuming you have a db module for database connection
// import { createClient } from '@supabase/supabase-js';

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

export async function getUser(username: string): Promise<User | null> {
    const [user] = await db`SELECT * FROM users WHERE username = ${username}`;
    if (!user) { return null; }
    const selectedUser = {
        userId: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last,
        gender: user.gender,
        sexualPreference: user.sexual_preferences,
        totalLikes: user.total_likes,
        userPreferences: user.user_preferences,
        location: user.location,
        bio: user.bio,
        age: user.age,
    };
    return selectedUser;
}

export async function updateUserLocation(username: string, latitude: number, longitude: number) {
    if (!username) throw new Error('Username is required');
    console.log('Updating location for user\nUsername is => ', username, '\nLatitude is => ', latitude, '\nLongitude is => ', longitude);
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