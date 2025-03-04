import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { updateEmail } from '$lib/server/users';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/');
    }
    return { user: event.locals.user };
};

export const actions: Actions = {
    changeEmail: async (event) => {
        if (!event.locals.user) {
            return redirect(302, '/');
        }
        try{
            await updateEmail(event.locals.user.email, event);
            return {status: 200, message: 'Email changed successfully' };
        } catch (error) {
            return fail(401, { message: 'Unexpected' + error });
        }
    },
    verifyEmail: async (event) => {
        try{
            
            return {status: 200, message: 'Verification email sent' };
        } catch (error) {
            return fail(401, { message: 'Unexpected error' });
        }
    },
};