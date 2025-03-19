import postgres from 'postgres';
import { json } from '@sveltejs/kit';
import { getIdByUsername, getUsernameById } from '$lib/server/utils';
import { db } from '$lib/server/db';
// import { env } from '$env/dynamic/private';
// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// const sql = postgres(env.DATABASE_URL, {
//     ssl: 'require',
//     onnotice: () => { } // Evitar mostrar mensajes NOTIFY en consola
// });

export async function POST({ request }) {
  const { visitedUserId, username } = await request.json();

  const type = 'visit';

  const visitedUsername = await getUsernameById(visitedUserId);
  const realUserID = await getIdByUsername(username);
  const message = `${visitedUsername[0].username}`;
  const blockedUsers = await db`
  SELECT blocked_users
  FROM users
  WHERE id = ${realUserID[0].id}
  `;
  const blockedUsersIds = blockedUsers[0].blocked_users;
  if (blockedUsersIds && blockedUsersIds.includes(visitedUserId)) {
    return json({ error: 'User is blocked' }, { status: 403 });
  }
  await db`
    INSERT INTO notifications (user_id, sender_id, type, message)
    VALUES (${realUserID[0].id}, ${visitedUserId}, ${type}, ${message});
  `;
  console.log('Notificación insertada en la base de datos');
  return json({ success: true });
}
