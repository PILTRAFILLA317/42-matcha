import { fail, redirect, type Actions } from '@sveltejs/kit';
import {
	updateAge,
	updateBio,
	updateEmail,
	updateFirstName,
	updateGender,
	updateLastName,
	updateSexualPreference,
	updateTags,
	updateUsername
} from '$lib/server/users';
import type { PageServerLoad } from '../$types';
import { checkTags } from '$lib/helpers/validators';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	console.log('user is=>\n\n', event.locals.user);
	return { user: event.locals.user };
};

export const actions: Actions = {
	updateUser: async (event) => {
		const formData = await event.request.formData();
		const user = event.locals.user ? event.locals.user : null;
		const username = formData.get('username');
		const firstName = formData.get('firstname');
		const lastName = formData.get('lastname');
		const age = formData.get('age');
		const gender: boolean = formData.get('gender') == 'Male' ? true : false;
		const sexualPreference = formData.get('sexual_preferences') as string;
		const bio = formData.get('bio');
		const tags: string[] = formData.getAll('tags') as string[];
		console.log("tags", tags);
		if (user === null) {
			return redirect(302, '/');
		}
		try {
			if (username !== null && username !== user.username) {
				return await updateUsername(username.toString(), event);
			}
			if (firstName !== null && firstName !== user.firstName) {
				await updateFirstName(firstName.toString(), event);
			}
			if (lastName !== null && lastName !== user.lastName) {
				await updateLastName(lastName.toString(), event);
			}
			if (age !== null && Number(age) !== user.age) {
				await updateAge(age.toString(), event);
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
			if (!checkTags(tags, user.userPreferences)){
				await updateTags(tags, event);
			}
			return { status: 201, message: 'User updated successfully' };
		} catch (error) {
			console.log('Error updatiing user');
			return fail(400, { message: error instanceof Error ? error.message : String(error) });
		}
	}
};
