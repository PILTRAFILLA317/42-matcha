import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token: string = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId: string = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt: Date = new Date(Date.now() + DAY_IN_MS * 30);

	await db`
		INSERT INTO sessions (id, user_id, expires_at)
		VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()})
	`;

	return { id: sessionId, userId: userId, expiresAt: expiresAt };
}

export async function validateSessionToken(
	token: string
): Promise<{ session: Session | null; user: User | null }> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	// Buscar sesión y usuario asociado
	const [result] = await db`
		SELECT 
			s.id AS session_id, s.user_id, s.expires_at, 
			u.id AS user_id, u.username
		FROM sessions s
		INNER JOIN users u ON s.user_id = u.id
		WHERE s.id = ${sessionId}
	`;

	// Si no hay sesión, retornamos null
	if (!result) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: result.session_id,
		userId: result.user_id,
		expiresAt: new Date(result.expires_at)
	};

	
	const [userResult] = await db`
	SELECT * FROM public.users WHERE id = ${result.user_id}`;
	// console.log('userResult->', userResult);
	const user: User = {
		userId: userResult.id,
		email: userResult.email,
		username: result.username,
		firstName: userResult.first_name,
		lastName: userResult.last_name,
		gender: userResult.gender,
		sexualPreferences: userResult.sexual_preferences,
		totalLikes: userResult.total_likes,
		userPreferences: userResult.user_preferences,
		bio: userResult.bio,
		verified: userResult.verified,
		images: userResult.profile_pictures,
		location: userResult.location,
		age: userResult.age,
		completed: userResult.completed
	};

	/*We compare the session's expiration date and if It has expired 
	We delete the session and return an empty user*/
	if (Date.now() >= session.expiresAt.getTime()) {
		await db`DELETE FROM sessions WHERE id = ${session.id}`;
		return { session: null, user: null };
	}

	// If the date expires in less than 15 days we renew the session
	if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db`
			UPDATE sessions
			SET expires_at = ${session.expiresAt.toISOString()}
			WHERE id = ${session.id}
		`;
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: number | string): Promise<void>{
	await db`DELETE FROM sessions WHERE id = ${sessionId}`;
}

export async function getSessionTokenCookie(event: RequestEvent): Promise<string | null> {
	const cookie: string | undefined = event.cookies.get(sessionCookieName);
	return cookie ?? null;
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: "lax",
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.delete(sessionCookieName, {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: '/'
	});
}
