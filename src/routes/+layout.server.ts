import type { LayoutServerLoad } from './$types';
import { goto } from '$app/navigation';

export const load = (async (event) => {
    return { user: event.locals.user };
}) satisfies LayoutServerLoad;