/**
 * Worker de tracking para el kit de prospección.
 *
 * Endpoints:
 *   GET /p?id=TRACKING_ID              → sirve un GIF 1×1 y registra "apertura"
 *   GET /c?id=TRACKING_ID&u=URL_REAL   → registra "clic", avisa por Telegram y redirige
 *
 * Variables de entorno (Settings → Variables del Worker):
 *   SHEET_WEBHOOK      → URL del Apps Script desplegado como Web App (obligatoria)
 *   SECRET            → token compartido con el Apps Script (opcional pero recomendado)
 *   TELEGRAM_TOKEN    → token del bot de Telegram (opcional; si falta, no hay alertas)
 *   TELEGRAM_CHAT_ID  → chat_id a donde llegan las alertas (opcional)
 *
 * Los eventos se envían a Apps Script y a Telegram sin bloquear la respuesta al
 * prospecto (ctx.waitUntil), así el píxel y el redirect son instantáneos.
 */

// GIF transparente de 1×1 px
const PIXEL = Uint8Array.from(
  atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
  (c) => c.charCodeAt(0)
);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || 'desconocido';

    if (url.pathname === '/p') {
      ctx.waitUntil(logEvent(env, id, 'apertura', request));
      return new Response(PIXEL, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      });
    }

    if (url.pathname === '/c') {
      const destino = url.searchParams.get('u');
      ctx.waitUntil(logEvent(env, id, 'clic', request));
      // El clic es la señal fiable de interés → alerta en tiempo real por Telegram.
      ctx.waitUntil(notifyTelegram(env, id, destino));
      if (destino && /^https?:\/\//i.test(destino)) {
        return Response.redirect(destino, 302);
      }
      return new Response('Enlace no válido', { status: 400 });
    }

    return new Response('OK', { status: 200 });
  },
};

async function logEvent(env, id, evento, request) {
  if (!env.SHEET_WEBHOOK) return;
  try {
    await fetch(env.SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.SECRET || '',
        id,
        evento,
        userAgent: request.headers.get('User-Agent') || '',
        fecha: new Date().toISOString(),
      }),
    });
  } catch (e) {
    // Si la Sheet falla, no rompemos el píxel/redirect
  }
}

async function notifyTelegram(env, id, destino) {
  // Sin credenciales configuradas ⇒ no hace nada (comportamiento previo intacto).
  if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  try {
    let hora;
    try {
      hora = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    } catch (e) {
      hora = new Date().toISOString();
    }
    const texto =
      '🔥 Clic de prospecto\n' +
      'ID: ' + id + '\n' +
      'Acaba de abrir su propuesta.\n' +
      (destino ? 'Destino: ' + destino + '\n' : '') +
      'Hora: ' + hora;
    await fetch('https://api.telegram.org/bot' + env.TELEGRAM_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: texto,
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    // Si Telegram falla, no rompemos el redirect
  }
}
