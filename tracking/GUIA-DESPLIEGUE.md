# Guía de despliegue del tracking de correos (~10 minutos)

Con esto verás en una Google Sheet quién **abrió** tu correo y quién **hizo clic** en tu propuesta.

## Paso 1 — Google Sheet + Apps Script (5 min)

1. Crea una Google Sheet en blanco, llámala por ejemplo **"Seguimiento prospectos"**.
2. Menú **Extensiones → Apps Script**. Borra lo que haya y pega el contenido de [apps-script.gs](apps-script.gs).
3. En la línea `var SECRET = 'CAMBIA-ESTE-SECRETO';` pon un secreto propio (cualquier texto largo). Guárdalo, lo necesitas en el paso 2.
4. Botón **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Tú**
   - Quién tiene acceso: **Cualquier persona**
5. Autoriza los permisos y **copia la URL que termina en `/exec`**.

## Paso 2 — Cloudflare Worker (5 min)

1. Crea cuenta gratis en [dash.cloudflare.com](https://dash.cloudflare.com) si no la tienes.
2. Menú **Workers & Pages → Create → Worker**. Ponle nombre, p. ej. `tracking-prospectos`. Deploy.
3. **Edit code** → borra todo y pega el contenido de [worker.js](worker.js) → **Deploy**.
4. En el Worker: **Settings → Variables and Secrets** → añade:
   - `SHEET_WEBHOOK` = la URL `/exec` del paso 1
   - `SECRET` = el mismo secreto que pusiste en el Apps Script
5. Copia la URL del Worker (algo como `https://tracking-prospectos.TU-USUARIO.workers.dev`).

## Paso 3 — Conectar con el kit

Edita [config.json](config.json) y pon tu URL del Worker en `worker_url`. A partir de ahí, la skill `prospeccion` generará los mensajes de contacto con el píxel y los enlaces rastreados ya insertados.

## Paso 4 — Probar que funciona

Abre en tu navegador:

```
https://TU-WORKER.workers.dev/p?id=PRUEBA-1
https://TU-WORKER.workers.dev/c?id=PRUEBA-1&u=https://google.com
```

La primera debe mostrar una imagen minúscula (o nada) y la segunda redirigirte a Google. En unos segundos deben aparecer las filas `PRUEBA-1 / apertura` y `PRUEBA-1 / clic` en la hoja **Eventos** de tu Sheet.

## Cómo se usa en los correos

Cada prospecto tiene un `tracking_id` (p. ej. `contadores-cdmx-03`). Su correo lleva:

- **Píxel** (al final del HTML, invisible):
  `<img src="https://TU-WORKER.workers.dev/p?id=contadores-cdmx-03" width="1" height="1" alt="">`
- **Enlace rastreado** (tu propuesta o tu web):
  `https://TU-WORKER.workers.dev/c?id=contadores-cdmx-03&u=https://tu-propuesta.com`

**Importante:** el correo debe enviarse como **HTML** (Gmail lo hace por defecto al pegar contenido con formato; el píxel no viaja en texto plano).

## Cosas que conviene saber

- **El clic es la señal fiable de interés.** Las aperturas pueden dar falsos positivos: Apple Mail y el proxy de imágenes de Gmail a veces precargan el píxel sin que el humano haya leído nada.
- **Antes de enviar en frío**, configura SPF, DKIM y DMARC en tu dominio para no caer en spam.
- El plan gratis de Cloudflare (100.000 peticiones/día) sobra de lejos para esto.
