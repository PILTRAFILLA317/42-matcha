import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
if (!env.IPGEOLOCATION_API_KEY) throw new Error('API is not set');

const API_KEY = env.IPGEOLOCATION_API_KEY;

export const GET = async ({ request }) => {
  try {
    // Si no puedes obtener la IP del cliente desde los encabezados, puedes usar la IP del servidor
    const clientIp = await fetch('https://api.ipgeolocation.io/getip').then((res) => res.json()).then((data) => data.ip);
    console.log('clientIp', clientIp);
    console.log('API_KEY', API_KEY);

    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}${clientIp ? `&ip=${clientIp}` : ''}`
    );
    const data = await response.json();

    if (response.ok) {
      return json({
        ip: clientIp || data.ip,
        city: data.city,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.time_zone.name,
        isp: data.isp
      });
    } else {
      return json({ error: data.message || 'Error consultando la API de ipgeolocation.io' }, { status: response.status });
    }
  } catch (err) {
    return json({ error: 'Error al contactar la API.' }, { status: 500 });
  }
};
