import { fail, json, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { db } from '$lib/server/db';

export const load: PageServerLoad = (async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	if (!event.locals.user.verified) {
		return redirect(302, '/verify');
	}
	if (!event.locals.user.completed) {
		return redirect(302, '/complete-profile');
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
}) satisfies PageServerLoad;

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
					ContentType: file.type,
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
			return { status: 200, message: 'File uploaded successfully uploaded' + filename };
		} catch (error) {
			if (error.code == '23514') return fail(401, { message: 'Max size of 5 images reached' });
			return fail(401, { message: 'Unexpected error' });
		}
	},
	deletePicture: async (event) => {
		if (!event.locals.user || !event.locals.session) {
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
			const client = new S3Client({
				region: env.SUPABASE_S3_REGION,
				endpoint: env.SUPABASE_S3_ENDPOINT,
				credentials: {
					accessKeyId: env.SUPABASE_S3_ACCESS_KEY,
					secretAccessKey: env.SUPABASE_S3_SECRET_KEY
				},
				forcePathStyle: true
			});
			client.send(new DeleteObjectCommand({Bucket: env.SUPABASE_S3_BUCKET_NAME, Key: event.locals.user.images[idNum - 1].split('/').pop()}));
			if ((event.locals.user.images.length - 1) === 0){
				await db`UPDATE users
				SET completed = ${false}
				WHERE id = ${event.locals.user.userId}
				AND EXISTS (SELECT 1 FROM sessions WHERE id = ${event.locals.session.id} AND user_id = ${event.locals.user.userId});
				`;
			}
			return { status: 200, message: 'Picture Deleted' };
		} catch (error) {
			return fail(401, { message: 'Unexpected error: try again later' });
		}
	}
};
