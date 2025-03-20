import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { validatePassword } from '$lib/helpers/validators';
import { updatePassword, updatePasswordRecover } from '$lib/server/users';
import { hash } from '@node-rs/argon2';

export const load: PageServerLoad = async (event) => {
	return {};
};

export const actions: Actions = {
	changepassword: async (event) => {
		try {
			const formData = await event.request.formData();
			const newPassword = formData.get('newpassword');
			if (!event.params.passwordRecovery) {
				return fail(401, { message: 'Invalid password recovery token' });
			}
			if (!validatePassword(newPassword as string)) {
				return fail(401, {
					message:
						'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
				});
			}
			if (typeof newPassword !== 'string') {
				return fail(401, { message: 'Invalid password' });
			}
			const passwordHash: string = await hash(newPassword, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			const ret = updatePasswordRecover(passwordHash, event.params.passwordRecovery);
			return ret;
		} catch (error) {
			return fail(401, { body: { message: 'Unexpected error' } });
		}
	}
};
