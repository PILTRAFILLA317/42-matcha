import { db } from '$lib/server/db';

export function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-zA-Z0-9._-]{3,31}$/.test(username)
	);
}

export function validateName(name: string): boolean {
	return (
		typeof name === 'string' &&
		/^[a-zA-ZÀ-ÿ' -]{2,50}$/.test(name)
	);
}

export async function usernameExists(username: string, userId: number): Promise<boolean> {
	const result = await db`SELECT 1 FROM users WHERE username = ${username} AND id != ${userId}`;
	return result.length == 0? false : true;
}

export function validateSexualPreference(spString: string): boolean {
	if (spString === 'Heterosexual' || spString === 'Homosexual' || spString === 'Bisexual') return true;
	return false;
}

export function validatePassword(password: string) {
	if (typeof password === 'string' && password.length >= 6 && password.length <= 255) {
		return true;
	}
	console.log('password validation failed');
	console.log('result', typeof password === 'string', password.length >= 6, password.length <= 255);
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
	return (
		typeof email === 'string' &&
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) // Validates email format
	);
}

export function validateBio(bio: string): boolean{
	if (bio.length > 500) return false;
	return true;
}

export function checkTags(newTags: string[], oldTags: string[]): boolean{
	if (oldTags === null) return false;
	newTags.sort();
	oldTags.sort();
	if (newTags.length !== oldTags.length) return false;
	for (let i = 0; i < newTags.length; i++){
		if (newTags[i] !== oldTags[i]) return false;
	}
	return true;
}