import postgres from 'postgres'; // Importa el paquete 'postgres'
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// 📌 Configura la conexión a PostgreSQL
const sql = postgres(env.DATABASE_URL, {
  ssl: 'require',
  onnotice: () => { } // Evita mostrar los mensajes de NOTIFY en la consola
});

export async function GET({ locals, request, setHeaders }) {
  // console.log('request:', request);
  // console.log('request.headers:', request.headers);
  // ✅ Setea los encabezados necesarios para que el cliente pueda recibir los eventos SSE
  setHeaders({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  // const userId = request.headers.get('user-id'); // Asume que el ID de usuario viene del header o de alguna otra forma
  const userId = locals.user?.userId; // Asume que el ID de usuario viene del header o de alguna otra forma

  if (!userId) {
    console.log('No autenticado o sin ID de usuario');
    return json({ error: 'No autenticado o sin ID de usuario' }, { status: 401 });
  }

  try {
    return new Response(
      new ReadableStream({
        start(controller) {
          console.log("✅ Cliente conectado al SSE:", userId);

          let isClosed = false;

          // 📡 Escuchar notificaciones en PostgreSQL
          sql.listen(`user_notifications_${userId}`, (payload) => {
            if (isClosed) return; // Evitar enviar si ya está cerrado

            console.log("🔔 Enviando notificación SSE:", payload);
            if (controller.desiredSize === 0) return; // Evitar enviar si el cliente no está listo
            try {
              controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`);
            } catch (error) {
              console.error("⚠️ Error al enviar datos SSE:", error);
              closeConnection();
            }
          });

          // Keep-alive cada 30s para evitar cierre de conexión
          const keepAlive = setInterval(() => {
            if (isClosed) {
              clearInterval(keepAlive);
              return;
            }
            if (controller.desiredSize === 0) return; // Evitar enviar si el cliente no está listo
            try {
              controller.enqueue(": keep-alive\n\n");
            } catch (error) {
              console.error("⚠️ Error en keep-alive SSE:", error);
              closeConnection();
            }
          }, 30000);

          // Función para cerrar la conexión correctamente
          const closeConnection = async () => {
            if (isClosed) return;
            isClosed = true;
            console.log("❌ Cliente desconectado del SSE.");

            clearInterval(keepAlive);

            // 🔴 **Desuscribirse manualmente del canal**
            try {
              await sql.end();
            } catch (err) {
              console.error("⚠️ Error cerrando listener:", err);
            }

            // 🔴 **Evitar cerrar el controlador si ya está cerrado**
            if (controller.desiredSize === 0) return;
            try {
              controller.close();
            } catch (error) {
              console.error("⚠️ Error al cerrar SSE:", error);
            }
          };

          // Cerrar si el cliente se desconecta
          controller.error = closeConnection;
        },
        cancel() {
          console.log("❌ Conexión SSE cancelada.");
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (err) {
    console.error("❌ Error en SSE:", err);
    return new Response(JSON.stringify({ error: "Error en SSE" }), { status: 500 });
  }


}
