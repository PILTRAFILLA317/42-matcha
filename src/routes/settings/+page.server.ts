import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	if (!event.locals.user.completed) {
		return redirect(302, '/complete-profile');
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
			console.log("User Deleted:", res);
			return redirect(302, '/');
		} catch (error) {
			console.log("Error Deleting User:", error);
			return (fail(400, {message: "Error Deleting User, try again later"}));
		}
	}
};
