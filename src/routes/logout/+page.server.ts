import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.session) {
        return redirect(302, '/auth/login');
    }
    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    // console.log("EEEEEEEONO");
    return redirect(302, '/auth/login');
};

// export const actions: Actions = {
// 	logout: async (event) => {
// 		if (!event.locals.session) {
// 			return fail(401);
// 		}
// 		await auth.invalidateSession(event.locals.session.id);
// 		auth.deleteSessionTokenCookie(event);

// 		return redirect(302, '/auth/login');
// 	}
// };
