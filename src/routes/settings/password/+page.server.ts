import { redirect , type Actions} from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { updatePassword, checkPassword } from '$lib/server/users';
import { hash } from '@node-rs/argon2';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/');
    }
    return { user: event.locals.user };
};

export const actions: Actions = {
    updatePassword: async (event) => {
        const formData = await event.request.formData();
        const user = event.locals.user ? event.locals.user : null;
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        console.log('Current password is => ', currentPassword);
        console.log('New password is => ', newPassword);
        console.log('Confirm password is => ', confirmPassword);
        if (user === null) {
            return redirect(302, '/');
        }
        if (currentPassword === null || newPassword === null|| confirmPassword === null) {
            throw new Error('All fields are required');
        }
        try {
            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            await checkPassword(currentPassword!.toString(), event);
            const passwordHash: string = await hash(String(newPassword), {
                    memoryCost: 19456,
                    timeCost: 2,
                    outputLen: 32,
                    parallelism: 1
            });
            await updatePassword(passwordHash, event);
        }
        catch (error) {
            console.log('Error updating password:\n');
        }
    },
};