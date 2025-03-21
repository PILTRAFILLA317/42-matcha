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

	enum sexualPreferences {
		Heterosexual = 1,
		Homosexual = 2,
		Bisexual = 3,
	}

	interface User {
		userId: string;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		gender: boolean;
		sexualPreferences: sexual_preferences = sexualPreferences.Bisexual;
		totalLikes: number = 0;
		userPreferences: string[] = [];
		location: Array<float>?;
		bio: string = '';
		verified: boolean = false;
		images: string[] = [];
		age: number = 0;
		completed: boolean;
	}
	interface UserFront{
		username: string;
		firstName: string;
		lastName: string;
		gender: boolean;
		sexualPreferences: sexual_preferences = sexualPreferences.Bisexual;
		totalLikes: number = 0;
		userPreferences: string[] = [];
		location: Array<float>?;
		bio: string = '';
		images: string[] = [];
		age: number;
		isOnline: boolean;
		lastConnection: Date;
	}

	interface Session {
		id: string;
		userId: string;
		expiresAt: Date;
	}

	interface Messages {
		sender: string;
		content: string;
	}
}

export { };
