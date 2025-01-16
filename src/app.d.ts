// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}

	enum sexualPreference{
		Heterosexual,
		Homosexual,
		Bisexual,
	}

	interface User{
		userId: number;
		username: string;
		firstName: string;
		secondName: string;
		gender: boolean?;
		sexualPreference: sexualPreference?;
		totalLikes: number?;
		userPreferences: Array<number>?;
	}

	interface Session{
		id: number;
		userId: number;
		expiresAt: Date;
	}
}




export {};
