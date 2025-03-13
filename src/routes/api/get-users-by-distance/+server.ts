import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return Math.round(distance);
}


export const POST = async ({ request, locals }) => {
    const userId = locals.user?.userId;
    const body = await request.json();
    const userAmount = body.userAmount;
    console.log("userId", userId);
    console.log("locals.user", locals.user);

    const location = locals.user?.location;
    if (!location) {
        console.log("location", location);
        return new Response('Location not available', { status: 400 });
    }

    const latitude = location[0];
    const longitude = location[1];

    console.log("latitude", latitude);
    console.log("longitude", longitude);

    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const allUsers = await db`
        SELECT *
        FROM users
        WHERE id != ${userId}
        AND location IS NOT NULL
        `;

        const users = allUsers
            .map(user => {
            const [userLat, userLng] = user.location;
            const distance = getDistance(latitude, longitude, userLat, userLng);
            return { ...user, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, userAmount);

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching users by distance:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};