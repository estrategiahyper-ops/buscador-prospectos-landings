# Prospección de Clientes

Este proyecto busca clientes potenciales en cualquier sector y ciudad, analiza su presencia digital y genera un informe con las mejores oportunidades y datos de contacto.

## 1. Comportamiento al iniciar

Cuando el usuario abra esta carpeta y escriba cualquier cosa, responde:

> **Bienvenido al buscador de clientes potenciales**
>
> Voy a buscar negocios de tu sector, analizar su presencia digital y encontrar los que más necesitan tus servicios.
>
> Necesito 3 cosas:
> 1. **¿Qué tipo de negocio buscas?** (restaurantes, clínicas, gimnasios, abogados...)
> 2. **¿En qué ciudad o zona?**
> 3. **¿Qué servicio les vas a ofrecer?** (diseño web, SEO, marketing, automatización...)

Después usa la skill `prospeccion` automáticamente.

## 2. Qué hace

1. Busca negocios reales del sector y ciudad indicados
2. Analiza la web de cada uno (HTTPS, responsive, SEO, redes sociales...)
3. Puntúa la oportunidad de cada negocio según el servicio que ofreces
4. Genera un informe HTML con tabla de prospectos, análisis detallado de los mejores, y mensajes de contacto personalizados
5. Exporta los datos en JSON para importar en CRM o Google Sheets
6. (Opcional) Inserta tracking de aperturas y clics en los mensajes de email — ver `tracking/GUIA-DESPLIEGUE.md`

## 3. No necesita nada instalado

Claude usa WebSearch y WebFetch nativos. Si tienes Firecrawl o Playwright, los usará para resultados más completos.

## 4. INSTRUCCIONES ESPECÍFICAS PARA AGENTES

Esta sección lista las reglas explícitas, la documentación interna y las skills especializadas disponibles para los agentes que operen en este repositorio.

### 4.1 Documentación interna para agentes

- Este `CLAUDE.md` raíz es la única política a nivel de proyecto. No agregues archivos de política locales dentro de las skills (ni `CLAUDE.md` ni `AGENTS.md` por skill).
- Las skills locales viven en `skills/{nombre-skill}/SKILL.md`, con carpetas opcionales `assets/`, `references/` o `examples/`.
- `skills/setup.sh` es el mecanismo canónico de sincronización/enlace hacia las carpetas de cada asistente (`.claude/skills` es un symlink hacia `skills/`). Después de cambiar la política raíz o las skills, vuelve a ejecutar el script para los asistentes que uses.
- Importante: no crees un `AGENTS.md` en la raíz de este proyecto. Si existiera, `setup.sh` lo copiaría encima de este `CLAUDE.md` y lo sobrescribiría; aquí la fuente de verdad es `CLAUDE.md`.

### 4.2 Asignación de modelos

Lee esta tabla al inicio de la sesión (o antes de la primera delegación), consérvala durante la sesión y pasa el alias mapeado en cada llamada a la herramienta Agent mediante el parámetro `model`. Si una fase no aparece, usa la fila `default`. Si no tienes acceso al modelo asignado (por ejemplo, sin acceso a Opus), sustituye por `sonnet` y continúa.

El modelo de la sesión de Claude Code lo controla el propio Claude Code; este proyecto no configura el modelo del `orchestrator` principal. Esta tabla aplica únicamente a los sub-agentes de fases SDD y a la delegación general.

Compuerta obligatoria de modelo: toda llamada a la herramienta Agent DEBE incluir `model`. Llamar a Agent sin `model` es inválido. Antes de cada llamada a Agent, resuelve la fase objetivo contra esta tabla; para delegación general (no SDD) usa `default`. Si estás a punto de llamar a Agent y no has elegido `model`, DETENTE y elige el alias mapeado.

| Phase | Default Model | Reason |
| :--- | :--- | :--- |
| sdd-explore | sonnet | Reads code, structural - not architectural |
| sdd-propose | opus | Architectural decisions |
| sdd-spec | sonnet | Structured writing |
| sdd-design | opus | Architecture decisions |
| sdd-tasks | sonnet | Mechanical breakdown |
| sdd-apply | sonnet | Implementation |
| sdd-verify | sonnet | Validation against spec |
| sdd-archive | haiku | Copy and close |
| sdd-onboard | haiku | Guided walkthrough, pedagogical |
| jd-judge-a | sonnet | Adversarial review - blind judge A |
| jd-judge-b | sonnet | Adversarial review - blind judge B |
| jd-fix-agent | sonnet | Surgical fixes from confirmed issues |
| default | sonnet | Non-SDD general delegation |

## 5. Uso de Skills

Usa estas skills para obtener patrones detallados bajo demanda.

### 5.1 Skills del proyecto

| Skill | Descripción | URL |
| :---- | :---------- | :-- |
| prospeccion | Busca clientes potenciales de un nicho, analiza su presencia digital y genera un informe con oportunidades y datos de contacto. | [SKILL.md](skills/prospeccion/SKILL.md) |
| demo-landing | Genera una landing de demostración personalizada para un prospecto a partir de su JSON real, con ciclo generar→revisar→corregir. Invocada por `prospeccion` (Paso 4). | [SKILL.md](skills/demo-landing/SKILL.md) |
| commits | Crea commits profesionales en formato conventional-commits, con mensajes en español (México). | [SKILL.md](skills/commits/SKILL.md) |
| skill-creator | Crea y actualiza skills locales de agente siguiendo el estándar Agent Skills. | [SKILL.md](skills/skill-creator/SKILL.md) |

### 5.2 Skills de invocación automática

Al realizar estas acciones, SIEMPRE invoca primero la skill correspondiente:

| Acción | Skill |
| :----- | :---- |
| Buscar clientes, hacer prospección, encontrar leads, analizar negocios de un sector | `prospeccion` |
| Generar demo web, landing de demostración, maqueta o activo web personalizado para un prospecto | `demo-landing` |
| Crear commits, al completar cambios de código, cuando el usuario pida hacer commit | `commits` |
| Crear, modificar o gestionar skills de agente | `skill-creator` |
| Sincronizar o enlazar skills en las carpetas de asistentes | Re-ejecuta `skills/setup.sh`; no existe una skill `skill-sync`. |

*Los agentes deben apegarse estrictamente a las convenciones del proyecto definidas en las secciones anteriores, junto con las instrucciones especializadas y mejores prácticas descritas arriba.*
