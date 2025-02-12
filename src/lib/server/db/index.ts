import postgres from 'postgres';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = postgres(env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    // ssl: 'require',
    // max: 200,
    // connect_timeout: 15,
    // idle_timeout: 30
});
