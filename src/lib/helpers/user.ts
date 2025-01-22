import { v4 as uuidv4 } from 'uuid';

export function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	// const bytes = crypto.getRandomValues(new Uint8Array(15));
	// const id = encodeBase32LowerCase(bytes);
	const id = uuidv4();
	return id;
}