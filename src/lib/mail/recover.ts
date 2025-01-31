import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
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
		})
		.catch((err) => {
			console.log(err.statusCode);
		});
}

export async function recoverPassword(email: string, recover_id: string) {
	try {
		const [user] = await db`SELECT * FROM users WHERE email = ${email}`;
		if (!user) {
			console.log('User not found');
			return;
		}
		console.log('User found: ', user.id);
		const result = await db`
			INSERT INTO password_recovery (id, user_id) 
			VALUES (${recover_id}, ${user.id})
		`;
		if (!result){
			console.log('Error inserting password recovery');
			return;
		}
		sendEmail(email, recover_id, user as User);
	} catch (error) {
		console.error('There was an error sending the recovery email: ', email, '\n', error);
	}
}
