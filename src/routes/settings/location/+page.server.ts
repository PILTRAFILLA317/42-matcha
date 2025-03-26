import type { Actions, PageServerLoad } from './$types';

export const load:  PageServerLoad  = async ({locals}) => {
    
    return {user: locals.user};
}

export const actions: Actions = {
    changeLocation: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get('name');
        const lat = formData.get('lat');
        const long = formData.get('long');
        console.log(name, lat, long);
        return {status: 200};
    },
};