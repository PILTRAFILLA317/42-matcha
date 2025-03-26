import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	if (!event.locals.user.verified) {
		return redirect(302, '/verify');
	}
	if (!event.locals.user.completed) {
		return redirect(302, '/complete-profile');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	deleteUser: async (event) => {
		try{
			if (!event.locals.user || !event.locals.session) {
				return redirect(302, '/');
			}
			const res = await db`DELETE FROM users WHERE id = ${event.locals.user.userId} AND EXISTS (SELECT 1 FROM sessions WHERE id = ${event.locals.session?.id} AND user_id = ${event.locals.user.userId});`;
		} catch (error) {
			return (fail(400, {message: "Error Deleting User, try again later"}));
		}
		return redirect(302, '/');
	}
};
