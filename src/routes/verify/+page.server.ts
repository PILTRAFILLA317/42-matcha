import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateUserId, sendVerificationEmail } from '$lib/helpers/user';
import { db } from '$lib/server/db';

export const load = (async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/');
    }
    return {user: event.locals.user};
}) satisfies PageServerLoad;

export const actions: Actions = {
    sendEmail: async(event) => {
        if (!event.locals.user) {
            return fail(400, {message: "User not found"});
        }
        const user: User = event.locals.user;
        try{
            const verify_id = generateUserId();
            await db`
                INSERT INTO verification (verify_id, user_id)
                VALUES (${verify_id}, ${user.userId})
            `;
            sendVerificationEmail(
                verify_id,
                user.email as string,
                {
                    userId: user.userId,
                    email: user.email as string,
                    username: user.username as string,
                    firstName: user.firstName as string,
                    lastName: user.lastName as string
                } as User
            );
            return {status: 200, message: "Email Sent to " + user.email};
        } catch (error) {
            return (fail(400, {message: "Error Sending Email, try again later"}));
        }
    }
};