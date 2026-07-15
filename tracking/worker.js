/**
 * Worker de tracking para el kit de prospección.
 *
 * Endpoints:
 *   GET /p?id=TRACKING_ID              → sirve un GIF 1×1 y registra "apertura"
 *   GET /c?id=TRACKING_ID&u=URL_REAL   → registra "clic" y redirige a URL_REAL
 *
 * Variables de entorno (Settings → Variables del Worker):
 *   SHEET_WEBHOOK  → URL del Apps Script desplegado como Web App (obligatoria)
 *   SECRET         → token compartido con el Apps Script (opcional pero recomendado)
 *
 * Los eventos se envían al Apps Script sin bloquear la respuesta al prospecto
 * (ctx.waitUntil), así el píxel y el redirect son instantáneos.
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
