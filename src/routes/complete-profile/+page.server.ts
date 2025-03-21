import * as users from '$lib/server/users';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { isCompleted } from '$lib/helpers/user';
import { checkTags } from '$lib/helpers/validators';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	try {
		const res = await db`
            SELECT profile_pictures FROM users
            WHERE id = ${event.locals.user.userId}
            `;
		return { user: event.locals.user, images: res[0].profile_pictures };
	} catch (error) {
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	uploadPicture: async (event) => {
		try {
			if (!event.locals.user) {
				return fail(401, { message: 'You must be logged in to upload a picture' });
			}
			const client = new S3Client({
				region: env.SUPABASE_S3_REGION,
				endpoint: env.SUPABASE_S3_ENDPOINT,
				credentials: {
					accessKeyId: env.SUPABASE_S3_ACCESS_KEY,
					secretAccessKey: env.SUPABASE_S3_SECRET_KEY
				},
				forcePathStyle: true
			});
			const formData = await event.request.formData();
			const file = formData.get('file') as File;
			if (!file) {
				return fail(401, { message: 'No file found' });
			}
			const buffer = Buffer.from(await file.arrayBuffer());
			if (buffer == 0) return fail(401, { message: '\n\n\n\nError converting file to buffer' });
			const filename = `${Date.now()}${file.name}`;
			const res = await client.send(
				new PutObjectCommand({
					Bucket: env.SUPABASE_S3_BUCKET_NAME,
					Key: filename,
					Body: buffer,
					ContentType: file.type
					// SSEKMSKeyId: event.locals.user?.userId
				})
			);
			const response = await db`
            UPDATE users
            SET profile_pictures = array_append(profile_pictures, ${env.SUPABASE_BUCKET_LOCATION + filename})
            WHERE id = ${event.locals.user.userId}
            `;
			if (res.$metadata.httpStatusCode != 200) {
				return fail(401, { message: 'Error uploading file\n' + res.Code });
			}
			if (isCompleted(event.locals.user)) {
				return {
					status: 200,
					message: 'File uploaded successfully uploaded' + filename,
					redirect: '/'
				};
			}
			return { status: 200, message: 'File uploaded successfully uploaded' + filename };
		} catch (error) {
			// console.log('Unexpected error: ', error);
			if (error.code == '23514') return fail(401, { message: 'Max size of 5 images reached' });
			return fail(401, { message: 'Unexpected error' });
		}
	},
	deletePicture: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'You must be logged in to delete a picture' });
		}
		try {
			const id: string | null = event.url.searchParams.get('id');
			if (!id) return fail(401, { message: 'No id found' });
			const idNum = parseInt(id) + 1;
			const response = await db`
                    UPDATE users
                    SET profile_pictures = array_remove(profile_pictures, profile_pictures[${idNum}])
                    WHERE id = ${event.locals.user.userId}
            `;
			// console.log('response is: ', response);
			// console.log('noseque parsed: ', event.locals.user.images[idNum - 1].split('/').pop());
			// console.log('picture deleted');
			const client = new S3Client({
				region: env.SUPABASE_S3_REGION,
				endpoint: env.SUPABASE_S3_ENDPOINT,
				credentials: {
					accessKeyId: env.SUPABASE_S3_ACCESS_KEY,
					secretAccessKey: env.SUPABASE_S3_SECRET_KEY
				},
				forcePathStyle: true
			});
			client.send(
				new DeleteObjectCommand({
					Bucket: env.SUPABASE_S3_BUCKET_NAME,
					Key: event.locals.user.images[idNum - 1].split('/').pop()
				})
			);
			return { status: 200, message: 'Picture Deleted' };
		} catch (error) {
			// console.log('Unexpected error: ', error);
			return fail(401, { message: 'Unexpected error: try again later' });
		}
	},
	updateUser: async (event) => {
		const formData = await event.request.formData();
		const user = event.locals.user ? event.locals.user : null;
		const gender: boolean = formData.get('gender') == 'Male' ? true : false;
		const sexualPreference = formData.get('sexual_preferences') as string;
		const bio = formData.get('bio');
		const tags: string[] = formData.getAll('tags') as string[];
		// console.log('tags', tags);
		if (user === null) {
			return redirect(302, '/');
		}
		try {
			if (gender !== null && gender !== user.gender) {
				await users.updateGender(gender, event);
			}
			if (sexualPreference !== null || sexualPreference !== user.sexualPreferences) {
				await users.updateSexualPreference(sexualPreference, event);
			}
			if (bio !== null && bio !== user.bio!) {
				await users.updateBio(bio as string, event);
			}
			if (!checkTags(tags, user.userPreferences)) {
				await users.updateTags(tags, event);
			}
            if (await isCompleted(user, event.locals.session)) {
                // console.log("this user in completed");
                return redirect(302, '/');
			}
			return { status: 201, message: 'User updated successfully' };
		} catch (error) {
			// console.log('Error updating user');
            if (error.status == 302) redirect(302, '/');
			return fail(400, { message: error instanceof Error ? error.message : String(error) });
		}
	}
};
