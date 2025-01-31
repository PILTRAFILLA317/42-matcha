import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { validatePassword } from '$lib/helpers/validators';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	changepassword: async (event) => {
		const formData = await event.request.formData();
		const newPassword = formData.get('password');

		if (!validatePassword(newPassword as string)) {
            console.log("entro aqui");
			return fail(401, {
				message:
					'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
			});
		}
        return ({ status: 200, body: { message: 'Password changed successfully' } });
	}
};
