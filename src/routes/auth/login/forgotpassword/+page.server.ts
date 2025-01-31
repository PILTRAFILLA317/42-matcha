import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { recoverPassword } from '$lib/mail/recover';
import { generateUserId } from '$lib/helpers/user';

export const load = (async (event) => {
    if (event.locals.user){
        return redirect(302, '/');
    }
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    recover: async (event) => {
        try{
            const formData = await event.request.formData();
            const email = formData.get('email');
            const recover_id = generateUserId();
            if (email === null)
                return ;
            recoverPassword(email.toString(), recover_id);
        }catch(error){
            console.error("There was an error sending the recovery email: ", error);
        }
    }
}