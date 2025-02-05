// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}

	enum sexual_preferences{
		Heterosexual,
		Homosexual,
		Bisexual,
	}

	interface User{
		userId: number;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		gender: boolean?;
		sexual_preferences: sexual_preferences?;
		totalLikes: number?;
		user_preferences: Array<number>?;
		location: Array<float>?;
		bio: string?;
	}

	interface Session{
		id: string;
		userId: string;
		expiresAt: Date;
	}
}

export {};
