import { redirect, type Actions } from '@sveltejs/kit';
import {updateEmail} from '$lib/server/updateUser';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/');
    }
    return {user : event.locals.user};
};

// deleteAccount: async (event) => {},

// changeDescription: async (event) => {},

// uploadPicture: async (event) =>{},

// deletePicture: async (event) => {},

// changeSexualPreference: async (event) => {},

// changeGender: async (event) => {},


export const actions: Actions = {
    updateUser: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email');
        const username = formData.get('username');
        const firstName = formData.get('firstname');
        const lastName = formData.get('lastname');
        const gender = formData.get('gender');
        const sexualPreference = formData.get('sexualpreference');
        const bio = formData.get('bio');
        try{
            if (email !== null && event.locals.user && email !== event.locals.user!.email) {
                await updateEmail(email!.toString(), event.locals.user!);
            }
        } catch (error){
            console.log("Error updatiing user:");
        }
        // return updated user
    },
    deleteUser: async (event) => {
        console.log("user should be deleted here");
    },

};