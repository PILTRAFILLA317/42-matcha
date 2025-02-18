import postgres from 'postgres';
import { json } from '@sveltejs/kit';
import { getUsernameById } from '$lib/server/utils';
import { db } from '$lib/server/db';
// import { env } from '$env/dynamic/private';
// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// const sql = postgres(env.DATABASE_URL, {
//     ssl: 'require',
//     onnotice: () => { } // Evitar mostrar mensajes NOTIFY en consola
// });

export async function POST({ request }) {
    const { visitedUserId, userId } = await request.json();

    const type = 'visit';

    // Inserta la notificación en la base de datos
    const visitedUsername = await getUsernameById(visitedUserId);
    const message = `${visitedUsername[0].username}`;

    // console.log('visitedUsername:', visitedUsername[0].username);
    // console.log('message:', message);
    // console.log('userId:', userId);
    // console.log('visitedUserId:', visitedUserId);
    // console.log('type:', type);
    await db`
    INSERT INTO notifications (user_id, sender_id, type, message)
    VALUES (${userId}, ${visitedUserId}, ${type}, ${message});
  `;
    console.log('Notificación insertada en la base de datos');

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
