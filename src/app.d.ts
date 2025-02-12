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

	export enum sexualPreference{
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
		sexualPreference: sexualPreference?;
		totalLikes: number?;
		userPreferences: Array<number>?;
		bio: string?;
		verified: boolean = false,
	}

	interface Session{
		id: string;
		userId: string;
		expiresAt: Date;
	}
}

export {};
