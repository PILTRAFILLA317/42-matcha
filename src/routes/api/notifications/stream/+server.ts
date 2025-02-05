import postgres from 'postgres'; // Importa el paquete 'postgres'
import { json } from '@sveltejs/kit';

// 📌 Configura la conexión a PostgreSQL
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  onnotice: () => {} // Evita mostrar los mensajes de NOTIFY en la consola
});

export async function GET({ request, setHeaders }) {
  // ✅ Setea los encabezados necesarios para que el cliente pueda recibir los eventos SSE
  setHeaders({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const userId = request.headers.get('user-id'); // Asume que el ID de usuario viene del header o de alguna otra forma

  if (!userId) {
    return json({ error: 'No autenticado o sin ID de usuario' }, { status: 401 });
  }

  try {
    // 📡 Escuchar solo las notificaciones del usuario específico
    return new Response(new ReadableStream({
      start(controller) {
        // 📡 Escuchar solo las notificaciones del usuario específico
        const listener = sql.listen(`user_notifications_${userId}`, (payload) => {
          // Si recibimos un mensaje en el canal, lo enviamos al cliente
          controller.enqueue(`data: ${payload}\n\n`);
        });

        // Devolver el controlador que escucha eventos del usuario
        listener;
      },
      cancel() {
        // Cerrar la conexión cuando el cliente termine de escuchar
        sql.unlisten(`user_notifications_${userId}`);
      }
    }));

  } catch (err) {
    return json({ error: 'Error en SSE' }, { status: 500 });
  }
}
