// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Locals {
		// 	user: import('$lib/server/auth').SessionValidationResult['user'];
		// 	session: import('$lib/server/auth').SessionValidationResult['session'];
		// }
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}

	enum sexualPreferences{
		Heterosexual,
		Homosexual,
		Bisexual,
	}

	interface User{
		userId: string;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		gender: boolean?;
		sexualPreferences: sexual_preferences?;
		totalLikes: number?;
		userPreferences: Array<number>?;
		location: Array<float>?;
		bio: string?;
		verified: boolean = false,
	}

	interface Session{
		id: string;
		userId: string;
		expiresAt: Date;
	}

	interface Messages{
		sender: string;
		content: string;
	}
}

export {};
