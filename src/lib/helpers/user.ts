import { v4 as uuidv4 } from 'uuid';
import Mailjet from 'node-mailjet';
import { env } from '$env/dynamic/private';

export function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	// const bytes = crypto.getRandomValues(new Uint8Array(15));
	// const id = encodeBase32LowerCase(bytes);
	const id = uuidv4();
	return id;
}

export function sendVerificationEmail(verify_id: string, email: string) {
	const email_body = `
	<h3>Welcome to FollarHoySi, the increible pagina web to follar hoy
		<a href="http://${env.URL}/auth/register/${verify_id}">
			Click aqui para confirmar la cuenta
		!</a>
	</h3>
	<br/>
		Si tienes la churra todo seca!
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
				Subject: 'Register confirmation [FollarHoySi]',
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
