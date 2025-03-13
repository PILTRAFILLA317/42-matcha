import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { notificator } from '$lib/server/utils';

async function getChats(userId: string) {
	try {
		let usernameList: Array<string> = [];
		const chats = await db`
            SELECT 
                CASE
                    WHEN user_1 = ${userId} THEN user_2
                    ELSE user_1
                END AS user_id
            FROM chats WHERE user_1 = ${userId} OR user_2 = ${userId}
        `;
		for (let i = 0; i < chats.length; i++) {
			let username = await db`
                SELECT (username) FROM users WHERE id = ${chats[i].user_id}
            `;
			usernameList.push(username[0].username);
		}
		return usernameList;
	} catch (error) {
		console.log('error: ', error);
		return [];
	}
}

async function sendMessage(senderId: string, reciverUser: string, message: string) {
	try {
		const res = await db`
            WITH receiver AS (
                SELECT id FROM users WHERE username = ${reciverUser}
            ), chat AS (
                SELECT id FROM chats 
                WHERE (user_1 = ${senderId} OR user_2 = ${senderId})
                AND (user_1 = (SELECT id FROM receiver) OR user_2 = (SELECT id FROM receiver))
            ) 
            INSERT INTO messages (chat_id, sender, content) 
            VALUES ((SELECT id FROM chat), ${senderId}, ${message})
            RETURNING *;
        `;
		const senderUsername = await db`
            SELECT username FROM users WHERE id = ${senderId}
			`;
		const reciverUserID = await db`
		SELECT id FROM users WHERE username = ${reciverUser}
		`;
		// console.log("senderUsername69: ", senderUsername[0].username);
		// console.log("senderId69: ", senderId);
		// console.log("reciverUser69: ", reciverUser);
		notificator(reciverUserID[0].id, senderUsername[0].username, "chat", senderUsername[0].username);
		// console.log("Mensaje enviado: ", res);
	} catch (error) {
		console.log('error: ', error);
	}
}

export const load = (async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	const matchedUsersList = await getChats(event.locals.user!.userId);
	return { user: event.locals.user, matchList: matchedUsersList };
}) satisfies PageServerLoad;

export const actions: Actions = {
	sendMessage: async (event) => {
		const formData = await event.request.formData();
		const message = formData.get('message');
		const selectedUser = formData.get('selectedUser');
		if (message === null || selectedUser === null) return;
		if (message.toString.length > 500 || selectedUser.toString.length > 50) return;
		sendMessage(event.locals.user!.userId, selectedUser.toString(), message.toString());
	},
};
