import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
if (!env.GEOAPIFY_API_KEY) throw new Error('API is not set');

const GEOAPIFY_API_KEY = env.GEOAPIFY_API_KEY;

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams;
    const locationName = query.get('query');
    const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${locationName}&limit=5&lang=es&apiKey=${GEOAPIFY_API_KEY}`
    );
    const data = await res.json();
    if (!data || !data.features) {
        return new Response(JSON.stringify({ error: 'No results found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify(data.features), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};