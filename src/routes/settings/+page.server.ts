import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	deleteUser: async (event) => {
		try{
			if (!event.locals.user) {
				return redirect(302, '/');
			}
			const res = await db`DELETE FROM users WHERE id = ${event.locals.user.userId}`;
			return redirect(302, '/');
		} catch (error) {
			return (fail(400, {message: "Error Deleting User, try again later"}));
		}
	}
};
