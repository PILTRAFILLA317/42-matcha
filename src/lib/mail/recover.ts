import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import Mailjet from 'node-mailjet';

function sendEmail(email: string, recover_id: string, user: User) {
	const email_body = `
	<h3>Hello ${user.firstName} ${user.lastName},</br>
        you requested a password recovery for your account on your account: ${user.username}
		<a href="http://${env.URL}/auth/login/forgotpassword/${recover_id}">
			Click aqui para cambiar la contraseña :)
		!</a></br>
	</h3>
    <h1>Si tienes la churra todo seca!</h1>
	`;
	const mailjet = Mailjet.apiConnect(env.MAILJET_API_KEY, env._MAILJET_API_KEY);
	const request = mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: env.SENDER_EMAIL,
					Name: "FollarhoySi's team"
				},
				To: [
					{
						Email: email,
						Name: email
					}
				],
				Subject: 'Password Recovery [FollarHoySi]',
				TextPart: "Un saludo one salute from FollarHoySi's team!",
				HTMLPart: email_body
			}
		]
	});
	request
		.then((result) => {
			console.log(result.body);
			return {status: 201, message: `Recovery email sent to ${email}`};
		})
		.catch((err) => {
			console.log(err.statusCode);
			return fail(401, {message: "Error sending email"});
		});
}

export async function recoverPassword(email: string, recover_id: string) {
	try{
		const [user] = await db`SELECT * FROM users WHERE email = ${email}`;
		if (!user) {
			return fail(401, { message: 'Email not found' });
		}
		const result = await db`
		INSERT INTO password_recovery (id, user_id) 
		VALUES (${recover_id}, ${user.id})
		`;
		if (!result) {
			return fail(401, { message: 'Unexpected error, try again later' });
		}
		const ret = sendEmail(email, recover_id, user as User);
		return ret;
	} catch (error){
		console.log(error);
		return fail(401, { message: error.message });
	}
}
