import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

async function getMatches(userId: string){
    try{
        let usernameList: Array<string> = [];
        const response = await db`
            SELECT liked_users FROM users WHERE id = ${userId}
        `;
        const likedUsers = response[0].liked_users;
        for (let i = 0; i < likedUsers.length; i++){
            let username = await db`
                SELECT username FROM users WHERE id = ${likedUsers[i]}
            `;
            usernameList.push(username[0].username);
        }
        return usernameList;
    }catch(error){
        console.log('error: ', error);
        return [];
    }
}

export const load = (async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/');
    }
    const matchedUsersList = await getMatches(event.locals.user!.userId);
    return { user: event.locals.user, matchList: matchedUsersList };
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