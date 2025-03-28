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

export function validateAge(age: string): boolean {
	if (Number.isNaN(age) === true) return false;
	if (Number(age) < 18) return false;
	if (Number(age) > 120) return false;
	return true;
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
	if (typeof password !== 'string')
		return true;
	return /^(?=(.*\d))(?!.*\s)(?=(.*[A-Z]))(?=(.*[a-z]))(?=(.*[\W_])).{8,20}$/.test(password);
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
	return false;
}

export function validateEmail(email: unknown): email is string {
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