import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';
import { hash } from '@node-rs/argon2';

const anuelLetra: string =
	"La definición de \"ser real\" en el diccionario e' mi foto\nYo le dije a Ozuna: \"El dinero no nos hace, lo hacemo' nosotro'\"\nY yo le dije a Balvin que la depresión e' un demonio sin un rostro\nY que estamo' donde estamo', bendeci'os porque Dios nos escogió a nosotro'";
const defaultImageOptions = [
	'https://cxcmnehhkrrtgcgsyrob.supabase.co/storage/v1/object/public/user_images//gatong.png',
	'https://cxcmnehhkrrtgcgsyrob.supabase.co/storage/v1/object/public/user_images//cigarrong.png',
	'https://cxcmnehhkrrtgcgsyrob.supabase.co/storage/v1/object/public/user_images//kratong.png',
	'https://cxcmnehhkrrtgcgsyrob.supabase.co/storage/v1/object/public/user_images//alieng.png'
];

export const load: PageServerLoad = async (event) => {
};

export const actions: Actions = {
	createUsers: async (event) => {
		let formData = await event.request.formData();
		let password = formData.get('SecurePin') as string;
		let count = formData.get('count') ?? '20';
		if (password !== 'Garfield Fumar 123') return fail(400, { message: 'Invalid password' });
		try {
			const response = await fetch(`https://randomuser.me/api/?results=${count}`);
			const data = await response.json();
			if (data.results.lenght === 0) return fail(400, { message: 'Random Users API error' });
			for (let user of data.results) {
				const defaultImage = [defaultImageOptions[Math.floor((Math.random() * 1000) % 4)]];
				const passwordHash = await hash(user.login.password, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
				await db`
				INSERT INTO users (id, email, username, password, first_name, last_name, verified, age, gender, sexual_preferences, bio, profile_pictures)
				VALUES (${user.login.uuid}, ${user.email}, ${user.login.username}, ${passwordHash}, ${user.name.first}, ${user.name.last}, ${true}, ${user.dob.age}, ${user.gender === 'female' ? false : true}, ${'Bisexual'}, ${anuelLetra}, ${defaultImage}::TEXT[])
				ON CONFLICT (id) DO NOTHING
				`;
			}
			return { status: 200, body: { message: 'Piola' } };
		} catch (error) {
			return fail(500, { message: 'Error' });
		}
		return { status: 200, body: { message: 'Piola' } };
	}
};
