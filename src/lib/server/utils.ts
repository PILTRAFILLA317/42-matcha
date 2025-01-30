import { validateEmail } from '$lib/helpers/validators';
import { db } from '$lib/server/db';

export async function getAllTags() {
    const tags = await db`SELECT * FROM tags`;
    return tags;
}