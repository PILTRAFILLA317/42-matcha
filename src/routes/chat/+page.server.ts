import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
        if (!event.locals.user) {
            return redirect(302, '/');
        }
    return { user: event.locals.user };
}) satisfies PageServerLoad;


export const actions: Actions = {
    sendMessage: async( event) => {
        const formData = await event.request.formData();
        const message = formData.get('message');
        const selectedUser = formData.get('username');
        console.log("que pasa manin");
        if (message === null || selectedUser === null)
            return ;
        if (message.toString.length > 500 || selectedUser.toString.length > 50)
            return;
        console.log("El mensaje para ", selectedUser, " es: ", message);
            
    }
    
};