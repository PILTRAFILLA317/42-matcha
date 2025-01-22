export function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
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
	return typeof email === 'string' && email.length >= 3 && email.length <= 255;
}
