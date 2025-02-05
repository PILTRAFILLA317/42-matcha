import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    //const {locals} = event; ionmi explicando Destructuring assignment
    if (!event.locals.user) {
        return redirect(302, '/auth/login');
    }
    return { user: event.locals.user };
};
