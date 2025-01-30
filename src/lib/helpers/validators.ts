import { db } from '$lib/server/db';

export function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-zA-Z0-9_-]+$/.test(username)
	);
}

export function validateName(name: string): boolean {
	return /^[a-zA-Z]+$/.test(name) && name.length >= 1 && name.length <= 40;
}

export async function usernameExists(username: string, userId: number): Promise<boolean> {
	const result = await db`SELECT 1 FROM users WHERE username = ${username} AND id != ${userId}`;
	console.log("username exist?", result? true : false);
	return result? true : false;
}

export function validateSexualPreference(sp: string): boolean {
	if (sp === 'Heterosexual' || sp === 'Homosexual' || sp === 'Bisexual') return true;
	return false;
}

export function validatePassword(password: unknown) {
	if (typeof password === 'string' && password.length >= 6 && password.length <= 255) {
		return true;
	}
	// To-do: implementar mas comprobaciones,
	// como que por lo menos haya una mayuscula y que por lo menos haya un numero
	return false;
}

export function validatePasswords(password: unknown, repeat_password: unknown) {
	if (
		password === repeat_password &&
		typeof password === 'string' &&
		typeof repeat_password === 'string' &&
		password.length >= 6 &&
		password.length <= 255
	) {
		return true;
	}
	// To-do: implementar mas comprobaciones,
	// como que por lo menos haya una mayuscula y que por lo menos haya un numero
	return false;
}

export function validateEmail(email: unknown): email is string {
	// To-do: implementar una comprobacion mas precisa

	//checks email type and lenght
	if (typeof email !== 'string') return false;
	if (email.length <= 3 || email.length >= 255) return false;

	return true;
}

export function validateBio(bio: string): boolean{
	if (bio.length > 500) return false;
	return true;
}
