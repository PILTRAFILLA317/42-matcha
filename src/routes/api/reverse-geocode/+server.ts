// src/routes/api/reverse-geocode/+server.ts
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
if (!env.GEOAPIFY_API_KEY) throw new Error('API is not set');

const GEOAPIFY_API_KEY = env.GEOAPIFY_API_KEY;

export const POST = async ({ request }) => {
  try {
    const { latitude, longitude } = await request.json();

    if (!latitude || !longitude) {
      return json({ error: 'Coordenadas inválidas.' }, { status: 400 });
    }

    // Llama a la API de Geoapify
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`
    );
    const data = await response.json();

    if (response.ok && data.features && data.features.length > 0) {
        // Extraer solo la ciudad
        const properties = data.features[0].properties;
        const city =
          properties.city || // Intentar obtener `city`
          properties.town || // O intentar obtener `town`
          properties.village || // O intentar obtener `village`
          'No se encontró la ciudad';
  
        return json({ city });
    }

  } catch (err) {
    return json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
};
