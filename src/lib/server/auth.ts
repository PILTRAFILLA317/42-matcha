import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);

	await db`
		INSERT INTO sessions (id, user_id, expires_at)
		VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()})
	`;

	return { id: sessionId, userId, expiresAt };
}

export async function validateSessionToken(token: string) {
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

	const session = {
		id: result.session_id,
		userId: result.user_id,
		expiresAt: new Date(result.expires_at),
	};

	const user = {
		id: result.user_id,
		username: result.username,
	};

	// Si la sesión ha expirado, la eliminamos y retornamos null
	if (Date.now() >= session.expiresAt.getTime()) {
		await db`DELETE FROM sessions WHERE id = ${session.id}`;
		return { session: null, user: null };
	}

	// Si faltan menos de 15 días para expirar, renovamos la sesión
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

export async function invalidateSession(sessionId: string) {
	await db`DELETE FROM sessions WHERE id = ${sessionId}`;
}


export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
