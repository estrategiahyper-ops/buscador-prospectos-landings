# Activos de valor para los correos

Para que el correo en frío **demuestre** valor en vez de solo prometerlo, a los mejores prospectos (top 10 de cada campaña) se les genera una página personalizada y en el correo va un enlace rastreado *"mira cómo quedaría lo tuyo →"*. Un clic ahí = interés fuerte.

## Los 3 activos

| Activo | Para quién | Plantilla |
|---|---|---|
| **Demo de web** | Sin web o web mala (venta de web/diseño) | `web-demo.html` |
| **Diagnóstico de fugas** | Automatización — muestra pérdidas concretas + antes/después | `diagnostico.html` |
| **Simulador de ahorro (ROI)** | Automatización — calculadora personalizada de ahorro | `roi.html` |

## Cómo se generan (lo hace la skill `prospeccion` automáticamente)

1. Se copia la plantilla y se sustituyen los tokens `{{...}}` con **datos reales** del prospecto.
2. El archivo resultante se guarda en `../demos-publicar/[tracking_id].html`.
3. Se despliega la carpeta a Cloudflare Pages:
   ```
   cd ../demos-publicar
   npx wrangler pages deploy . --project-name=demos-prospectos --commit-dirty=true
   ```
4. Cada demo queda pública en `https://demos-prospectos.pages.dev/[tracking_id]`.
5. En el correo, el CTA enlaza vía tracking:
   `https://tracking-prospectos.estrateg-ia-hyper.workers.dev/c?id=[tracking_id]-demo&u=https://demos-prospectos.pages.dev/[tracking_id]`

Las plantillas ya llevan su píxel de "abrió la demo", así que la hoja Eventos registra tanto la apertura del correo como la vista de la demo y el clic.

## Reglas

- **Solo datos reales y verificados.** El contenido de la demo usa el nombre, servicios y datos del prospecto; se enmarca como "maqueta/propuesta", nunca como sitio publicado.
- **Solo top 10 por campaña** — calidad sobre cantidad.
- El ejemplo en vivo (prospecto real del JSON de contadores): https://demos-prospectos.pages.dev/ejemplo-romero-silva
