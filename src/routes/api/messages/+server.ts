import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import type postgres from 'postgres';
import { parse } from 'svelte/compiler';

async function parseMessages(messages: postgres.RowList<postgres.Row[]>, user: User) {
	let parsedMessages = [];
	if (messages.length === 0) {
		return;
	}
	const res = await db`
        SELECT 
            u1.username AS user_1, 
            u2.username AS user_2 
        FROM chats 
        JOIN users u1 ON chats.user_1 = u1.id 
        JOIN users u2 ON chats.user_2 = u2.id 
        WHERE chats.id = ${messages[0].chat_id}
        `;
	if (res.length == 0) {
		return;
	}
	const myUser = res[0].user_1 == user.username ? res[0].user_1 : res[0].user_2;
	const otherUser = res[0].user_2 == user.username ? res[0].user_1 : res[0].user_2;
	for (let i = 0; i < messages.length; i++) {
		parsedMessages.push({
			sender: messages[i].sender == user.userId ? myUser : otherUser,
			content: messages[i].content
		});
	}
	parsedMessages.reverse();
	return parsedMessages;
}

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user){
		return json({ error: 'Not logged in' }, { status: 401 });
	}
	try {
		const otherUser = url.searchParams.get('user');
		const res = await db`
            WITH receiver AS (
                SELECT id FROM users WHERE username = ${otherUser}
            ), chat AS (
                SELECT id FROM chats 
                WHERE (user_1 = ${locals.user!.userId} OR user_2 = ${locals.user!.userId})
                AND (user_1 = (SELECT id FROM receiver) OR user_2 = (SELECT id FROM receiver))
            ) 
            SELECT * FROM messages WHERE chat_id = (SELECT id FROM chat)
        `;
		console.log("res is: ", res);
		console.log("id is: ", locals.user!.userId);
		const messages = await parseMessages(res, locals.user);
		return json({ body: messages }, { status: 200 });
	} catch (error) {
		console.log('Error: ', error);
		return json({ error: 'Error getting messages' }, { status: 500 });
	}
};
