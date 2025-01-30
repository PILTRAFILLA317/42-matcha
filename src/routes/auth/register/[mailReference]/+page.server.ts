import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const mailReference = params.mailReference as string;
		const result = await db`
        SELECT user_id, verify_id FROM verification WHERE verify_id = ${mailReference}::uuid
        `;
		if (result.length === 0) {
			return { status: 404, error: 'Verification not found' };
		}
        console.log("look at me!: ", result[0].user_id);
        console.log('mailReference: result is\n', result);
		await db`
            UPDATE users
            SET verified = TRUE
            WHERE id = ${result[0].user_id};
        `;
		return;
	} catch (e) {
		console.log('mailReference: Error is\n', e);
	}
};