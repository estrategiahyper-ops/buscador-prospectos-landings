# Mapeo de datos: JSON del prospecto → secciones de la landing

Referencia de la skill `demo-landing`. Define qué campo del registro real alimenta cada
sección y qué está permitido inventar (nada verificable) contra qué es copia genérica de
relleno del sector. Todo el texto visible va en español formal de México (usted).

## Regla fundamental: dos tiers (D2)

- **Tier A — datos verificados (VERBATIM del JSON).** Contacto, dirección, redes, y
  cualquier número o hecho. Se copian **tal cual** del registro. **Campo nulo/ausente ⇒ el
  elemento se OMITE** por completo; nunca se rellena con placeholders ni con ejemplos.
- **Tier B — copia de maqueta (genérica del sector).** Textos típicos de servicios y FAQ
  derivados de `sector` (afinados según `servicio_usuario`, ver abajo). Son genéricos y
  **sin especificidades fabricadas**: cero cifras, precios, horarios, años de experiencia o
  nombres inventados. **`oportunidades` y `problemas_detectados` NO alimentan Tier B**: son
  brechas del vendedor (mejoras que el prospecto aún NO tiene, p. ej. `crm_automatizacion:false`,
  `agenda_online:false`) y **solo** se usan, invertidas, como marco de la sección **why-us**
  (ver tabla). Renderizarlas como servicios del prospecto haría fallar el eje binario de datos.

Si un contenido no es Tier A (rastreable a un campo) ni Tier B (genérico del sector sin
datos inventados), **no se renderiza**.

**`servicio_usuario` afina el énfasis de Tier B** (no inventa contenido): oriente qué brecha
resalta más la maqueta. P. ej. "diseño web" ⇒ acabado visual/UX y una sección de servicios
clara; "automatización"/"marketing" ⇒ prominencia al flujo de contacto y a la atención por
WhatsApp cuando `whatsapp:true`.

## Prohibiciones (validator C, R1)

- **`notas` es información interna del vendedor: NUNCA se renderiza** en la demo, en
  ningún atributo, comentario HTML ni tooltip. Es solo para el operador.
- **NUNCA capturas del sitio actual del prospecto**, ni imágenes de él, ni comparaciones
  "antes/después" lado a lado. La ventaja se muestra implícitamente vía la sección why-us.
- **Prohibido inventar ESPECIFICIDADES:** testimonios/reseñas, barras de estadísticas
  ("+120 clientes", "15 años"), horarios, precios, alcances concretos, credenciales o
  nombres. La prohibición apunta a datos **fabricados y verificables**, NO al **nombrado
  genérico de servicios típicos del sector** (Tier B), que sí está permitido siempre que no
  afirme una especificidad inventada. Es decir, "conciliamos" el "prohibido servicios que no
  estén en el JSON": lo prohibido son alcances/precios/credenciales fabricados, no describir
  servicios que cualquier negocio del sector normalmente ofrece.
- **`redes_sociales` sin URL:** renderice un **chip/ícono NO enlazado** con el nombre de la
  red; **nunca fabrique** una URL de perfil. Enlácelo solo si el JSON incluye la URL real.
- **Ningún stat puede contradecir el registro.** Ejemplos: no afirmar "Sitio seguro con
  HTTPS" si `https:false`; no presumir "agenda en línea" si `agenda_online:false`; no
  mencionar redes que no estén en `redes_sociales`.

## Campos del registro (referencia)

`empresa, url, tiene_web, telefono, telefono_alt[], email, whatsapp (bool), direccion,
oportunidad_score, web_calidad, https, agenda_online, crm_automatizacion,
redes_sociales[], problemas_detectados[], oportunidades[], estado_prospecto, notas`.

De estos, **`oportunidad_score`, `web_calidad`, `estado_prospecto`, `notas`** son internos
y **no se renderizan**. `https`, `agenda_online`, `crm_automatizacion` solo se usan como
guardas negativas (para no afirmar lo que es falso), nunca como claims positivos salvo que
sean `true`.

## Tabla sección → campo

| Sección | Fuente (campo JSON) | Tier | Regla |
| --- | --- | --- | --- |
| **navbar** | `empresa`; ancla a las secciones | A | Nombre del negocio verbatim. Logo = iniciales/monograma tipográfico, nunca logo inventado. |
| **hero** | `empresa`, `sector`, `ciudad` + CTA (`telefono`/`whatsapp`/`email`) | A | Titular = propuesta genérica del sector para `empresa` en `ciudad`. CTA principal según contacto disponible (omit-if-null). |
| **about** | `empresa`, `direccion`, `redes_sociales[]` | A | Solo lo presente. Sin `direccion` ⇒ sin bloque de ubicación. Redes: solo las listadas, como **chip/ícono NO enlazado** con el nombre de la red; **nunca invente URLs de perfil** (enlace solo si el JSON trae la URL). Lista vacía ⇒ sin bloque de redes. |
| **why-us** | `problemas_detectados[]` + `oportunidades[]` **invertidos** en beneficios resueltos | A→B | Cada problema/oportunidad se reformula como un beneficio que la **maqueta demuestra** (p. ej. "Solo Facebook" → "Presencia en más canales"; `agenda_online:false` → "Agenda en línea"). No se cita el problema como defecto textual del prospecto, ni se presenta la mejora como algo que el prospecto ya tiene. |
| **services** | `sector` (Tier B) + capacidades reales Tier A (p. ej. WhatsApp si `whatsapp:true`) | A+B | Tarjetas de servicios **típicos del sector** (nombrado genérico permitido) más capacidades reales respaldadas por el JSON. **No** liste `oportunidades` (son upsells del vendedor, no servicios del prospecto). Descripción genérica; sin precios ni alcances inventados. Ajuste el énfasis según `servicio_usuario`. |
| **FAQ** | Tier B (preguntas típicas del sector) + respuestas de contacto Tier A | A+B | Preguntas genéricas del sector; respuestas de contacto (teléfono/horario de atención) solo si el dato existe en el JSON. Formato `<details>`. |
| **footer** | contacto (`telefono`, `email`, `direccion`, `redes_sociales`) + sello Estrateg IA Hyper + píxel | A | Datos de contacto reales (omit-if-null), **sello Estrateg IA Hyper** (D10, copia VERBATIM abajo) y **marco de maqueta**, píxel de tracking según D8. |

## Sello Estrateg IA Hyper (footer, D10)

El footer lleva un bloque **sello** visualmente distintivo (no reemplaza ni opaca los CTAs
del prospecto). Es copia de la **agencia** (no un dato del prospecto): va en **toda** demo,
siempre. Copia **VERBATIM** (es-MX, usted), no la reformule ni la resuma:

- **Titular:** "Generada de forma 100% automatizada por Estrateg IA Hyper"
- **Línea de apoyo:** "Automatizamos flujos de trabajo, escenarios con agentes de IA y
  tareas manuales con software e inteligencia artificial — imagine lo que podemos automatizar
  en su negocio."

El estilo del sello (bloque de acento con la paleta propia de la página, ≥4.5:1, distinto del
resto del footer) se define en `references/diseno-visual.md` §4.5.

## CTAs desde datos reales (Tier A, omit-if-null)

| Dato | CTA | Nulo/false ⇒ |
| --- | --- | --- |
| `telefono` | Botón "Llamar" → `tel:` **directo** | Omitir botón |
| `whatsapp:true` (+ `telefono`) | Botón "WhatsApp" → `https://wa.me/52<10dígitos>` (envuelto `/c`). **Normalice el número antes de armar el link** (ver abajo). | Omitir botón |
| `email` | Botón "Correo" → `mailto:` **directo** | Omitir botón |
| `direccion` | Enlace a mapa (http/https, envuelto `/c`) si se arma una URL de maps | Omitir |

**Normalización del número de WhatsApp (lada de México `52`):** antes de construir el link,
(1) elimine todo caracter que no sea dígito; (2) si el resultado empieza con `52`, quítelo;
(3) tome los **últimos 10 dígitos**; (4) anteponga `52`. Ejemplos:
- `id:6` con `+52 55 1234 5678` ⇒ dígitos `525512345678` → quita `52` inicial → `5512345678`
  → últimos 10 `5512345678` → `https://wa.me/525512345678`.
- `id:1` con `55 1234 5678` (sin lada) ⇒ dígitos `5512345678` → sin `52` inicial → últimos 10
  `5512345678` → `https://wa.me/525512345678`.

Reglas de envoltura/píxel: ver D8 en `SKILL.md` (solo destinos http(s) se envuelven con
`/c`; `tel:`/`mailto:` directos; píxel `p?id=[tracking_id]-demo`; `worker_url` vacía ⇒ sin
tracking).

## Ejemplos de trazabilidad (con `prospectos-contadores-cdmx.json`)

- **id:1 (con web).** `empresa:"Romero Silva y Asociados SC"`, `redes_sociales:["Facebook"]`,
  `problemas_detectados:["Solo Facebook", ...]`. why-us puede ofrecer "más canales de
  contacto"; NO afirmar HTTPS (`https:false`); `whatsapp:true` ⇒ botón WhatsApp;
  `notas` (screenshot de su sitio) **no se usa**.
- **id:2 (sin web).** `email:null`, `whatsapp:null`, `redes_sociales:[]`. Se **omiten** los
  bloques de correo, WhatsApp y redes; queda el CTA de teléfono. Sin placeholders.

## Checklist de datos (verificación previa a generar)

- [ ] Cada claim visible mapea a un campo del JSON o es Tier B genérico del sector.
- [ ] Ningún stat contradice el JSON (`https`, `agenda_online`, `redes_sociales`, cifras).
- [ ] `notas` no aparece en ninguna parte del HTML.
- [ ] Sin capturas ni comparativas del sitio actual del prospecto.
- [ ] Campos nulos ⇒ bloques omitidos, no placeholders.
- [ ] Sin testimonios, barras de stats, horarios ni precios inventados.
- [ ] `services` = servicios típicos del sector + capacidades reales; `oportunidades` NO se listan como servicios.
- [ ] `redes_sociales` como chips NO enlazados (sin URLs de perfil inventadas).
- [ ] Número de WhatsApp normalizado a `52` + últimos 10 dígitos.
- [ ] Sello Estrateg IA Hyper en el footer (titular + línea de apoyo VERBATIM, visualmente distinto).
