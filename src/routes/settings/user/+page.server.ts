import { fail, redirect, type Actions } from '@sveltejs/kit';
import {
	updateBio,
	updateEmail,
	updateFirstName,
	updateGender,
	updateLastName,
	updateSexualPreference,
	updateUsername
} from '$lib/server/users';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	updateUser: async (event) => {
		const formData = await event.request.formData();
		const user = event.locals.user ? event.locals.user : null;
		const email = formData.get('email');
		const username = formData.get('username');
		const firstName = formData.get('firstname');
		const lastName = formData.get('lastname');
		const gender: boolean = formData.get('gender') == 'Male' ? true : false;
		const sexualPreference = formData.get('sexual_preferences') as string;
		const bio = formData.get('bio');
		if (user === null) {
			return redirect(302, '/');
		}
		try {
			if (email !== null && email !== user.email) {
				await updateEmail(email!.toString(), event);
			}
			if (username !== null && username !== user.username) {
				return await updateUsername(username.toString(), event);
			}
			if (firstName !== null && firstName !== user.firstName) {
				await updateFirstName(firstName.toString(), event);
			}
			if (lastName !== null && lastName !== user.lastName) {
				await updateLastName(lastName.toString(), event);
			}
			if (gender !== null && gender !== user.gender) {
				await updateGender(gender, event);
			}
			if (sexualPreference !== null || sexualPreference !== user.sexualPreferences) {
				await updateSexualPreference(sexualPreference, event);
			}
			if (bio !== null && bio !== user.bio!) {
				await updateBio(bio as string, event);
			}
			return { status: 201, message: 'User updated successfully' };
		} catch (error) {
			console.log('Error updatiing user');
			return fail(400, { message: error instanceof Error ? error.message : String(error) });
		}
	}
};
