---
name: prospeccion
description: "Encuentra clientes potenciales buscando negocios de un nicho, analizando su presencia digital y generando un informe con datos de contacto y oportunidades. Usa esta skill cuando el usuario quiera buscar clientes, hacer prospección, encontrar leads, analizar negocios de un sector, o buscar empresas a las que ofrecerles servicios. Triggers: 'buscar clientes', 'prospección', 'encontrar leads', 'lista de clientes potenciales', 'a quién le vendo', 'encontrar empresas de [sector]', 'buscar negocios en [ciudad]', 'analizar competencia', 'scraping de negocios'."
---

# Prospección de Clientes

Le dices un sector + ubicación y Claude busca negocios reales, analiza su presencia digital, puntúa la oportunidad y genera un informe con los mejores prospectos y sus datos de contacto.

**Regla fundamental: solo datos reales.** Cada negocio, teléfono, web y dato de contacto debe ser real y verificado. No inventes negocios ni datos de contacto.

## Paso 1 - Definir la búsqueda

Pregunta al usuario:
- **¿Qué tipo de negocio buscas?** (restaurantes, clínicas, gimnasios, abogados, agencias, tiendas...)
- **¿En qué ciudad o zona?** (Barcelona, Madrid centro, Valencia, una provincia entera...)
- **¿Qué servicio les vas a ofrecer?** - esto afecta cómo se puntúa la oportunidad (si vendes webs, un negocio sin web es oportunidad máxima; si vendes SEO, una web sin optimizar es la oportunidad)
- **¿Cuántos prospectos necesitas?** (18, 25, 50)

## Paso 2 - Buscar negocios reales

Usa las herramientas disponibles para encontrar negocios reales. Orden de prioridad:

### Opción 1 - WebSearch (siempre disponible)
Busca en Google con queries específicas:
- '[nicho] en [ciudad]' - resultados orgánicos
- '[nicho] [ciudad] teléfono' - para encontrar datos de contacto
- '[nicho] [ciudad] opiniones' - Google Business results
- 'site:paginasamarillas.es [nicho] [ciudad]' - directorio

### Opción 2 - Firecrawl MCP (si está configurado)
Si tiene Firecrawl, scrapea directorios directamente:
- Páginas Amarillas / QDQ / Yelp
- Google Maps (resultados de búsqueda)
- Directorios específicos del sector

### Opción 3 - Playwright (si está instalado)
Navega a directorios y extrae listados de negocios con sus datos.

### Qué extraer de cada negocio
- **Nombre** del negocio
- **Web** (URL si tiene)
- **Teléfono**
- **Email** (si está visible)
- **Dirección**
- **Google Maps / Google Business** (si aparece)
- **Redes sociales** (Instagram, Facebook, etc.)

**Si no puedes encontrar suficientes negocios automáticamente**, dile al usuario cuántos encontraste y pregunta si quiere que busques de otra forma o si tiene URLs que quiera analizar directamente.

## Paso 3 - Analizar la presencia digital

Para cada negocio encontrado que tenga web, analízala con WebFetch:

### Checklist de análisis
- **¿Tiene web?** - si no tiene, oportunidad máxima para servicios de web
- **¿HTTPS?** - ¿tiene certificado SSL?
- **¿Responsive?** - ¿tiene meta viewport?
- **¿SEO básico?** - ¿tiene title, meta description, h1?
- **¿Velocidad?** - tiempo de respuesta del servidor (curl)
- **¿Redes sociales?** - buscar links a Instagram, Facebook, LinkedIn, etc. en la web
- **¿Google Business?** - ¿tiene ficha con reseñas?
- **¿Diseño moderno?** - ¿se ve como una web de 2024+ o parece de 2015?
- **¿Contenido?** - ¿tiene blog, páginas de servicios, fotos?

### Puntuación de oportunidad
Puntúa cada negocio de **0 a 10** (`oportunidad_score` en el JSON, se muestra como `N/10` en el informe) según el servicio que ofrece el usuario. 10 = máxima oportunidad de venta.

**Si vende webs/diseño:**
- Sin web = 9-10
- Web antigua + sin responsive + sin HTTPS = 8
- Web aceptable pero fea/lenta = 5-7
- Web moderna = 0-4

**Si vende SEO:**
- Sin meta tags + sin h1 + sin content = 9-10
- SEO parcial (title pero sin description) = 6-8
- SEO básico cubierto = 3-5
- SEO bien hecho = 0-2

**Si vende marketing/redes:**
- Sin redes sociales = 9-10
- Redes con pocos seguidores/sin actividad = 6-8
- Redes activas pero sin estrategia = 3-5
- Marketing digital completo = 0-2

Adapta el scoring al servicio que ofrece el usuario. Mantén siempre la escala 0-10 para que coincida con el JSON y el informe HTML.

## Paso 4 - Generar el informe
HTML Dashboard visual con todos los prospectos. Libertad creativa total en diseño.

### Contenido obligatorio
1. **Resumen ejecutivo** - Total encontrados, distribución por nivel de oportunidad (gráfico), top 5 recomendados
2. **Tabla de prospectos** - Ordenada por oportunidad, con:
   - Nombre del negocio (link a su web si tiene)
   - Teléfono y email (si encontrados)
   - Dirección
   - Score de oportunidad (barra visual de color)
   - Nivel digital (bajo/medio/alto con badge)
   - Problemas detectados (Lista corta)
   - Link a Google Maps si está disponible
3. **Ficha detallada de los top 5-10** - Para los mejores prospectos:
   - Análisis completo de su presencia digital
   - 3 problemas concretos encontrados
   - Propuesta de valor personalizada para ese negocio
   - Mensaje de contacto en frío listo para enviar (personalizado con datos reales del negocio y problemas detectados)
4. **Estadísticas del nicho** - Vista general del sector:
   - % sin web
   - % sin HTTPS
   - % sin SEO
   - % sin redes sociales
   - Conclusión sobre la oportunidad del nicho
5. **Datos exportables** - Tabla de contactos con botón para copiar todos los emails/teléfonos

### Sobre los mensajes de contacto

**Tono y lenguaje (obligatorio): español formal de México, trato de usted.**
- **Siempre de usted**, nunca tutear: "su despacho", "le preparé", "si le interesa" (no "tu web", "te armé", "si te late").
- **Español de México profesional.** Evita coloquialismos ("le late", "órale", "chance", "ahorita") y españolismos ("vale", "vosotros", "móvil", "ordenador" → usar "celular", "computadora").
- **Saludo formal:** "Estimado/a [nombre o cargo]:" o "Buen día." Si no se conoce el nombre, dirigirse al negocio: "Estimados señores de [Empresa]:".
- **Despedida formal:** "Quedo al pendiente de sus comentarios." / "Saludos cordiales," seguido de la firma.
- **Firma fija (usar siempre, sin placeholders):** `Shmin · Estrategia Hyper · 56 1021 1798`. Presentación en el cuerpo: "Mi nombre es Shmin, de Estrategia Hyper."
- **Cortesía sin servilismo:** profesional y directo, no rebuscado. Frases como "me permití preparar", "con gusto le explico", "sin ningún compromiso".

Además, los mensajes deben ser:
- **Personalizados** con el nombre del negocio y un problema real encontrado
- **Concretos** - no genéricos, que el destinatario sienta que se revisó su presencia digital de verdad
- **Cortos** - máximo 6-8 líneas
- **Sin presión** - ofrecer valor, no vender agresivamente

Ejemplo del tono correcto:
> Estimados señores de [Empresa]:
>
> Al revisar la presencia digital de su despacho, noté que [problema concreto]. Me permití preparar [activo de valor] para mostrarles cómo podría resolverse: [enlace].
>
> Si les parece interesante, con gusto les explico los detalles en una llamada breve, sin ningún compromiso.
>
> Saludos cordiales,
> [Nombre] · Estrategia Hyper · [teléfono]

Este mismo tono formal aplica a los **activos de valor** (demos, diagnósticos, simuladores): todo el texto visible al prospecto va de usted.

### Tracking de aperturas y clics (opcional)
Lee `tracking/config.json` del proyecto. Si `worker_url` tiene valor:

1. Asigna a cada prospecto un `tracking_id` único y estable: `[nicho]-[ciudad]-[NN]` (ej: `contadores-cdmx-03`). Inclúyelo en el JSON exportado.
2. Genera cada mensaje de contacto en **dos versiones**: texto plano (para WhatsApp/llamada) y **HTML para email** con tracking:
   - Al final del HTML: `<img src="[worker_url]/p?id=[tracking_id]" width="1" height="1" alt="">`
   - Todo enlace del mensaje envuelto: `[worker_url]/c?id=[tracking_id]&u=[URL_destino_url-encoded]`
3. En el informe HTML, junto a cada mensaje pon un botón "copiar HTML del correo".
4. Recuerda al usuario: el correo debe enviarse como HTML, y el **clic** es la señal fiable de interés (la apertura puede dar falsos positivos por proxies de imágenes).

Si `worker_url` está vacía, genera los mensajes sin tracking y menciona que puede activarlo siguiendo `tracking/GUIA-DESPLIEGUE.md`.

### Activos de valor (demo personalizada por prospecto)
Para que el correo demuestre valor en vez de solo prometerlo, genera un **activo personalizado** para el **top 10** de prospectos (por `oportunidad_score`). Los demás reciben el correo normal sin demo. Regla de oro: **solo datos reales verificados**; el activo se enmarca siempre como "maqueta/propuesta", nunca como algo ya publicado.

**Compuerta de deliverabilidad (obligatoria, antes de generar cualquier activo):** el activo de valor se entrega por **correo** (borrador en Gmail con el enlace rastreado). Por lo tanto, **solo genera el activo si el prospecto tiene `email` no nulo**. Si `email` es nulo, **NO gastes recursos** en generar/desplegar su maqueta: márcalo como **contacto telefónico** en el informe y sáltalo. Para elegir el top 10 al que se le genera activo, filtra **primero** por `email` presente y luego ordena por `oportunidad_score` (un prospecto sin correo nunca entra al lote de maquetas, aunque su score sea alto). Excepción manual: si más adelante un prospecto sin correo entrega uno (p. ej. en una llamada), se le puede generar el activo bajo demanda para ese caso puntual.

Elige el activo según el hueco del prospecto y el servicio que vende el usuario:

- **Demo de web** → prospectos SIN web o con web mala (cuando el usuario vende web/diseño). **Se genera invocando la skill `demo-landing`** (una invocación por prospecto), pasándole su contrato: `{prospecto: <registro JSON completo>, sector, ciudad, servicio_usuario, tracking_id, worker_url}`. Esa skill resuelve paleta (marca/sector), imágenes locales, sello de agencia y el ciclo generar→revisar→corregir, y devuelve un `resumen` por demo que debes incluir en el reporte de campaña. **No uses la plantilla vieja `tracking/plantillas-valor/web-demo.html`** (obsoleta; queda solo como referencia histórica).
- **Hiperautomatización (infografía)** → activo principal para prospectos de automatización/procesos. Es una **infografía fija y genérica** (no personalizada) que explica a grandes rasgos, con gancho de curiosidad y enfoque en dinero/rentabilidad, cómo Estrategia Hyper convierte el trabajo manual y repetitivo en procesos automáticos. Ya está creada y publicada: imagen en `tracking/activos-imagen/hiperautomatizacion.png`, página en `https://demos-prospectos.pages.dev/hiperautomatizacion`. **No se regenera por prospecto**; el correo lleva un enlace rastreado por prospecto `/c?id=[tracking_id]-auto&u=https://demos-prospectos.pages.dev/hiperautomatizacion`. El correo lleva un gancho breve y personalizado (una tarea manual real observada) y luego el enlace. Usa la paleta/marca real de Estrategia Hyper (navy #0A1330, azul #2E5BFF; brand-package en `/Users/emmanuelheredia/Downloads/Estrateg IA/brand-package/`).
- **Diagnóstico de fugas / Simulador ROI → activos de PASO 2** (no en el correo en frío): se reservan para cuando el prospecto responde interesado, como profundización. Plantillas en `tracking/plantillas-valor/{diagnostico,roi}.html`.

Flujo del lote (top 10 filtrado por email):
1. **Prospectos de web**: genera su demo invocando `demo-landing` (queda en `tracking/demos-publicar/[tracking_id].html` con assets en `assets/[tracking_id]/`). **Prospectos de automatización**: no se genera nada — usan la infografía fija ya publicada.
2. Si generaste demos nuevas, despliega la carpeta **a producción**:
   `cd tracking/demos-publicar && npx wrangler pages deploy . --project-name=demos-prospectos --branch=main --commit-dirty=true`
   (sin `--branch=main`, wrangler usa la rama git actual y puede irse a una URL de preview). La URL pública será `https://demos-prospectos.pages.dev/[tracking_id]`.
3. En el mensaje de email, el CTA principal es un enlace rastreado:
   - Web: `[worker_url]/c?id=[tracking_id]-demo&u=https://demos-prospectos.pages.dev/[tracking_id]`
   - Automatización: `[worker_url]/c?id=[tracking_id]-auto&u=https://demos-prospectos.pages.dev/hiperautomatizacion`
   (así un clic ahí = el prospecto miró la propuesta = interés fuerte; además dispara la alerta de Telegram).
4. Las demos de web ya incluyen su propio píxel `[worker_url]/p?id=[tracking_id]-demo`; la página de la infografía registra vistas con el id genérico `hiperautomatizacion-view`.

Si `worker_url` está vacía, enlaza los activos como URLs/archivos planos y avisa que sin tracking no sabrás si los vieron.

## Paso 5 - Guardar y presentar
- Guarda como "prospeccion-[nicho]-[ciudad].html"
- Guarda también "prospeccion-[nicho]-[ciudad].json" con los datos crudos (para CRM, Sheets, etc.)
- Abre el HTML en el navegador

Presenta:
1. Cuántos negocios encontraste y analizaste
2. Distribución de oportunidades
3. Top 3 prospectos en una frase
4. Pregunta si quiere profundizar en alguno o buscar más

No muestres precios sugeridos ni consejos de venta.
