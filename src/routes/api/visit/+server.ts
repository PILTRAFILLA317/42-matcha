import postgres from 'postgres';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getUsernameById } from '$lib/server/utils';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const sql = postgres(env.DATABASE_URL, {
    ssl: 'require',
    onnotice: () => { } // Evitar mostrar mensajes NOTIFY en consola
});

export async function POST({ request }) {
    // console.log('request:', request);
    // console.log('request.body:', request.body);
    // console.log('request.body.userId:', request.body.userId);
    const { visitedUserId, userId } = await request.json();

    const type = 'visit';

    // Inserta la notificación en la base de datos
    const visitedUsername = await getUsernameById(visitedUserId);
    const message = `${visitedUsername[0].username}`;

    await sql`
    INSERT INTO notifications (user_id, sender_id, type, message)
    VALUES (${userId}, ${visitedUserId}, ${type}, ${message});
  `;

    // Notificación en el canal específico del usuario
//     console.log('userId:', userId);
//     console.log('message:', message);
//     await sql`
//     SELECT pg_notify(
//       'user_notifications_' || ${userId}, 
//       json_build_object(
//         'message', ${message}::text,
//         'type', ${type}::text
//       )::text
//     );
//   `;

    return json({ success: true });
}
