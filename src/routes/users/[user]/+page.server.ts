import * as auth from '$lib/server/auth';
import * as users from '$lib/server/users';
// import {getUser} from '$lib/server/users';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../../$types';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/auth/login');
    }
    const currentUser = await users.getUser(String(event.params.user));
    if (!currentUser)
        return {user: event.locals.user};
    return { user: event.locals.user, currentUser, session: event.locals.session};
};

export const actions: Actions = {
    logout: async (event) => {
        if (!event.locals.session) {
            return fail(401);
        }
        await auth.invalidateSession(event.locals.session.userId);
        auth.deleteSessionTokenCookie(event);

        return redirect(302, '/auth/login');
    },
};
