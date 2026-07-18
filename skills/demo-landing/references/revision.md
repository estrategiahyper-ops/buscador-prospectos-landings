# Revisión: rúbrica, capturas y política de iteraciones

Referencia de la skill `demo-landing`. Define el ciclo generar → **revisar** → corregir que
una demo debe pasar antes de aceptarse. Este proyecto **no tiene test runner**: la
verificación es el sustituto por checklist (inspección de HTML, capturas playwright-cli,
chequeos de archivo), no pruebas unitarias.

## Rúbrica (3 ejes, en 320 / 768 / 1024 px)

Una demo se **acepta** solo si pasa los tres ejes en los tres breakpoints.

| Eje | Qué mide | Criterio |
| --- | --- | --- |
| **datos** | Correctitud de contenido (todo claim mapea al JSON) + **sello VERBATIM** | **Binario: todos deben pasar.** Un solo dato inventado o contradictorio (p. ej. "HTTPS" con `https:false`, `notas` filtrado, testimonio inventado) ⇒ **falla**. También **falla** si el **sello Estrateg IA Hyper** no está correcto: verifique el **titular VERBATIM** ("Generada de forma 100% automatizada por Estrateg IA Hyper"), la **línea de apoyo** presente y que el sello se vea **visualmente distinto** del resto del footer. |
| **responsive** | Layout a 320/768/1024 px | Sin scroll horizontal (`scrollWidth ≤ innerWidth`), sin solapes ni texto cortado, objetivos táctiles ≥44px, imágenes con espacio reservado. |
| **utilidad** | La demo acerca el cierre | 7 secciones presentes, CTAs de contacto reales funcionando, marco de maqueta + sello Estrateg IA Hyper visibles (sin opacar los CTAs), se ve como una landing moderna del sector. |

El eje **datos** es binario y de máxima prioridad: si falla, la demo no se acepta aunque
el resto luzca bien.

## Modo A — con playwright-cli (preferido, R9)

`playwright-cli` (v0.1.14+) **bloquea el esquema `file://`**: no es un fallback, simplemente
no carga. Sirva el directorio de la demo por **HTTP local** y revise en `http://localhost:PORT`.

```bash
# Servir el directorio de la demo en segundo plano (elija un PORT libre de la sesión, p. ej. 8123)
python3 -m http.server PORT --directory tracking/demos-publicar &
SERVER_PID=$!

# Abrir la demo por HTTP local (NUNCA file://)
playwright-cli open "http://localhost:PORT/[tracking_id].html"
```

Para cada breakpoint 320, 768 y 1024 (px de ancho):

```bash
# Ancho del breakpoint (alto orientativo)
playwright-cli resize 320 800

# Guardar la captura en un TEMPORAL DE SESIÓN — NUNCA dentro de demos-publicar/
playwright-cli screenshot --filename="$TMPDIR/[tracking_id]-320.png"

# Chequeo de overflow horizontal (true = OK)
playwright-cli --raw eval "document.documentElement.scrollWidth <= window.innerWidth"

# Errores de JS en consola
playwright-cli console
```

Repita `resize`+`screenshot`+`eval`+`console` para `768` y `1024`. Inspeccione cada
captura contra la rúbrica. Cierre con `playwright-cli close` y **detenga el servidor**
(`kill $SERVER_PID`).

**Regla de ubicación de capturas:** las imágenes de revisión viven en un directorio
temporal de la sesión (p. ej. el scratchpad de la sesión o `$TMPDIR`). **NUNCA** se guardan
dentro de `tracking/demos-publicar/` (se desplegarían junto con la demo).

Si todos los breakpoints pasan la rúbrica ⇒ `revision: aprobada`.

## Modo B — degradado por checklist (si playwright-cli no está disponible, R9)

Si `playwright-cli` no está instalado, **no bloquee**: haga una revisión estática y
registre `revision: solo-checklist`.

- Inspeccione el HTML directamente (estructura, media queries, unidades relativas).
- Verifique con chequeos de archivo: existencia de `assets/[tracking_id]/*`, rutas
  relativas correctas, píxel/CTAs según D8.
- Checklist estático de responsive:
  - [ ] Existen media queries o layout fluido (sin anchos fijos en px del contenedor).
  - [ ] Sin `width` fijos mayores al viewport de 320px en elementos de bloque.
  - [ ] Imágenes con `max-width:100%`/`height:auto`, `width`/`height` y `loading="lazy"`.
  - [ ] Objetivos táctiles ≥44px; base 16px; `<meta viewport>` presente.
  - [ ] `lang="es-MX"`, `alt` reales, `<details>` para FAQ.
- Checklist de datos (ver `mapeo-datos.md`) y de utilidad (7 secciones, marco de maqueta,
  sello Estrateg IA Hyper con titular + línea de apoyo VERBATIM y visualmente distinto,
  CTAs reales).

Registre siempre **qué modo se usó** (`aprobada` vía playwright, o `solo-checklist`).

## Política de iteraciones (R8, D7)

- Si la rúbrica falla, aplique una **corrección** al HTML y vuelva a revisar.
- **Máximo 2 iteraciones de corrección.** Si tras la segunda sigue fallando, **NO** siga
  iterando: marque `revision: revision-manual`, continúe con el resto del lote y repórtelo
  en el `resumen`/reporte de campaña para revisión humana.
- **Cuarentena obligatoria de `revision-manual`:** una demo marcada `revision-manual` debe
  **salir de la carpeta de deploy**. Muévala a una carpeta hermana **fuera** de
  `tracking/demos-publicar/` (p. ej. `tracking/revision-manual/[tracking_id].html` con sus
  `assets/`), para que un deploy masivo con wrangler **no pueda publicar** una demo fallida.
  Solo regresa a `demos-publicar/` tras corrección humana.
- `iteraciones` en el `resumen` = número de correcciones aplicadas (0, 1 o 2).

## Valores de `revision` para el resumen

| Valor | Cuándo |
| --- | --- |
| `aprobada` | Pasó los 3 ejes en 320/768/1024 (con playwright o checklist). |
| `revision-manual` | Siguió fallando tras 2 iteraciones; se **mueve fuera de `demos-publicar/`** (cuarentena). |
| `solo-checklist` | Se revisó sin playwright-cli (modo degradado); indica el modo usado. |
