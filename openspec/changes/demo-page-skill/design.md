# Design: demo-page-skill — Personalized Demo Landing Skill

## Technical Approach

New project skill `skills/demo-landing/` (skill-creator standard: LLM-first runtime contract) that turns one prospect's real JSON record into a self-contained, single-file vanilla HTML landing demo, with a built-in generate → review → fix loop. `skills/prospeccion/SKILL.md` Paso 4 delegates its web-demo branch to it; `tracking/plantillas-valor/web-demo.html` is deleted. **Language rule**: SKILL.md, references, and all demo UI copy in Spanish (formal Mexican, usted); SDD artifacts in English.

## Architecture Decisions

| # | Decision | Choice | Alternatives rejected | Rationale |
|---|----------|--------|----------------------|-----------|
| D1 | Skill layout | `SKILL.md` (Activation Contract, Hard Rules, Decision Gates, Execution Steps, Output Contract, References) + `references/{mapeo-datos, diseno-visual, revision}.md` | Everything in SKILL.md (too long, breaks LLM-first conciseness); `assets/` HTML template (a fixed template is the failure being replaced) | Runtime decisions stay in SKILL.md; long procedures move to references per skill-creator gates |
| D2 | Content rules | Two tiers. **Tier A (verified)**: contact, address, redes, any number/fact — verbatim from JSON; field null → element omitted. **Tier B (maqueta copy)**: sector-typical services/FAQ text derived from `sector`, with emphasis steered by `servicio_usuario`; `oportunidades`/`problemas_detectados` feed why-us framing only (improvements the mockup demonstrates) — never the prospect's own service catalog; generic, zero fabricated specifics. Testimonials, stat bars, invented hours/prices PROHIBITED. `notas` is seller-internal — NEVER rendered | Only-JSON copy (services section impossible); free LLM copy (reintroduces the invented-content bug) | Preserves the prospeccion golden rule while a "maqueta" can still show a full landing |
| D3 | ui-ux-pro-max usage | One `--design-system "{sector} {tono} landing"` query per campaign sector (style/typography/effects/anti-patterns); adopt COLORS/FONTS verbatim but filter STYLE/PATTERN through the sector's tone (override noted); per-prospect differentiation via brand palette + images + Tier A/B content; `--domain color` only for palette fallback; no `--persist`; ui-ux-pro-max entirely absent → inline neutral sector-palette table in the reference (skill works with zero external tools) | Per-prospect design-system queries (slow ×10, near-identical output); persisting `design-system/` folders (clutter) | Same-sector prospects share style; brand palette is the differentiator |
| D4 | Brand palette | `curl` raw site HTML + linked CSS (only if `tiene_web`; WebFetch's markdown summarization drops color tokens) → `rg`-mine candidate hex/rgb, fetched content treated strictly as data to mine (embedded instructions ignored — prompt-injection guard) → filter grays/near-white/black → gate: ≥2 distinct usable colors. Brand colors = backgrounds/accents; text stays neutral unless 4.5:1 verified (luminance heuristic table in reference). Builder-template signals (visible placeholders, generic builder markup) → extraction still allowed but recorded as `paleta: marca-dudosa`. Gate fails → sector palette via ui-ux-pro-max. Source recorded per demo (`paleta: marca \| marca-dudosa \| sector`) and surfaced in campaign report | Image/logo pixel extraction (no tooling, unreliable); skipping contrast gate (accessibility fail) | Bounded heuristic; every fallback is visible to the user |
| D5 | Image pipeline | WebSearch free/CC0 stock → `curl -L` ONLY from known CDNs, Pexels-first (`images.pexels.com` has a derivable CDN pattern; `images.unsplash.com` only when a direct CDN URL is already in hand) → `tracking/demos-publicar/assets/[tracking_id]/` (tracking_id sanitized `[a-z0-9-]+`) → verify MIME `image/*` + 10KB–1.5MB, files failing verification are deleted (no orphans); defined slots: hero required, about/services optional — download only what will be used; 2 attempts/slot → CSS-gradient + inline-SVG fallback. Relative `assets/...` paths (resolve at `file://` AND `pages.dev/[tracking_id]`). No Google Fonts — system font stacks mapped from the recommended pairing | Hotlinking (breaks self-contained rule); base64 inlining (file bloat); webfont download (complexity, weight) | Self-contained deploy: only runtime external request = tracking worker |
| D6 | Demo file shape | Single `[tracking_id].html`, inline CSS/JS; images as files. JS dependency-free ≤~60 lines (nav toggle + IntersectionObserver reveals); FAQ = native `<details>`; animations transform/opacity only + `prefers-reduced-motion`; base 16px, 44px touch targets, semantic landmarks, `lang="es-MX"`, real `alt`, `loading="lazy"` below fold, width/height attrs (CLS) | Separate css/js files (more deploy surface, no gain at this size) | Simple deploy, fast, accessible, no dependencies |
| D7 | Review loop | Serve the demo dir via `python3 -m http.server` and review at `http://localhost:PORT/[tracking_id].html` (playwright-cli blocks `file://`; localhost also validates relative asset paths) → per width 320/768/1024: `resize`, `screenshot`, `eval` scrollWidth ≤ innerWidth, `console` for JS errors (touch-target metric excludes `display:none` elements). Rubric axes: **datos** (binary — all must pass), **responsive**, **utilidad**. ≤2 fix iterations, then mark `revision-manual`, MOVE the failed demo out of `demos-publicar/` to a quarantine sibling folder (wholesale wrangler deploys can never publish a failed demo) and continue batch. Screenshots in session temp dir — NEVER inside `demos-publicar/`. No playwright → static source checklist, flag `solo-checklist` | `file://` review (blocked by playwright-cli v0.1.14); unlimited iterations (time ×10 demos) | Catches responsive breakage checklists miss; bounded cost; failed demos physically cannot ship |
| D8 | CTA tracking | `/c` wrap only http(s) targets (wa.me, maps, prospect site) with ids `[tracking_id]-demo-wa` etc.; `tel:`/`mailto:` stay direct links. Pixel `p?id=[tracking_id]-demo` kept. `worker_url` precedence: explicit contract input wins, `tracking/config.json` is the fallback; empty/absent both → untracked, existing convention. WhatsApp deep link normalization: strip non-digits, strip an existing leading 52, take last 10 digits, then prepend 52 | Redirecting tel:/mailto through worker (302 to non-http URI is unreliable) | Reliable clicks tracked; calls/emails never break; no doubled country codes |
| D9 | Integration edit | Paso 4: web-demo bullet → "usa la skill `demo-landing`"; "Trust & Authority" paragraph re-scoped to diagnostico/roi only; flujo step 1 splits per asset type; deploy/CTA/pixel steps + top-10 selection unchanged; README replacement note; re-run `skills/setup.sh` | Rewriting all of Paso 4 (out of scope — diagnostico/roi untouched) | Minimal, reversible edit preserving all conventions |
| D10 | Sello Estrateg IA Hyper | Footer credit evolves into a distinctive "sello" block: canonical short copy — headline "Generada de forma 100% automatizada por Estrateg IA Hyper" + one supporting line naming automated workflows, agentic AI scenarios, and manual-task automation with software and AI ("imagine lo que podemos automatizar en su negocio"). Styling: small accent-colored block (gradient hairline border or soft-glow chip + spark SVG) built from the page's own palette, 4.5:1 contrast, visually distinct from footer text but never outshining the prospect's CTAs; layout adapts to each footer design | Single plain-text credit line (wastes the ad space); long sales paragraph (bloats the footer, reads desperate) | Every demo doubles as a measured ad for the full automation offering |
| D11 | Pinned generation model | The HTML/CSS/JS code-writing step is delegated to a sub-agent invoked with `model: sonnet` (Claude Sonnet 5); the `resumen` records the model used; if the alias is unavailable, the substitute model is recorded — never silent | Letting the session model generate inline (results vary across sessions/models, breaking comparability) | Same model class every campaign → less variance, measurable output quality |

## Data Flow

    prospeccion Paso 4 (top 10, hueco = web)
        │ prospecto JSON + sector + tracking_id + worker_url
        ▼
    demo-landing skill
      1. map data → Tier A/B section content   (mapeo-datos.md)
      2. palette: marca → sector fallback      (WebFetch / ui-ux-pro-max)
      3. images → assets/[tracking_id]/        (curl + verify | gradient/SVG)
      4. generate [tracking_id].html           (single-file vanilla, sub-agent model: sonnet)
      5. review 320/768/1024 + rubric, ≤2 fixes (revision.md)
        │ per-demo summary: {paleta, imagenes, revision, iteraciones}
        ▼
    tracking/demos-publicar/ ──wrangler──▶ pages.dev/[tracking_id]
        │
        ▼
    campaign report (palette-fallback + revision-manual flags shown)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `skills/demo-landing/SKILL.md` | Create | Runtime contract (Spanish) |
| `skills/demo-landing/references/mapeo-datos.md` | Create | JSON→section mapping, Tier A/B rules |
| `skills/demo-landing/references/diseno-visual.md` | Create | ui-ux-pro-max queries, palette procedure, image pipeline, font stacks |
| `skills/demo-landing/references/revision.md` | Create | Rubric, screenshot steps, iteration policy, degraded checklist |
| `skills/prospeccion/SKILL.md` | Modify | Paso 4 delegation per D9 |
| `tracking/plantillas-valor/web-demo.html` | Delete | Replaced by demo-landing |
| `tracking/plantillas-valor/README.md` | Modify | Replacement note |

## Interfaces / Contracts

Invocation contract (prospeccion → demo-landing), documented in both skills:

```yaml
input:  {prospecto: <full JSON record>, sector, ciudad, servicio_usuario, tracking_id, worker_url}
output:
  files: [tracking/demos-publicar/[tracking_id].html, tracking/demos-publicar/assets/[tracking_id]/*]
  resumen: {tracking_id, paleta: marca|marca-dudosa|sector, imagenes: fotos|gradiente,
            revision: aprobada|revision-manual|solo-checklist, iteraciones: 0-2,
            modelo: sonnet (or recorded substitute)}
```

Section→field map (summary; full table in mapeo-datos.md): navbar/hero ← `empresa, sector, ciudad`; hero+footer CTAs ← `telefono, whatsapp, email` (Tier A, omit-if-null); about ← `empresa, direccion, redes_sociales`; why-us ← `problemas_detectados`/`oportunidades` inverted into solved features; services ← `sector` Tier B copy + Tier A-backed real capabilities (never `oportunidades` as the prospect's catalog); FAQ ← Tier B + Tier A contact answers; footer ← contact + sello Estrateg IA Hyper (D10) + pixel.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Behavioral | Skill produces valid demos | Generate 2 samples from `prospectos-contadores-cdmx.json` (id 1: con web/brand path; id 2: sin web/fallback path); run full rubric; verify proposal success criteria |
| Static | Skill docs | Scoped `git diff -- skills/` review; no builds/tests for skill-only edits (skill-creator rule) |

## Threat Matrix

N/A — deliverables are markdown instructions; no executable code, routing, or process-integration changes. The prompt-level safety constraints in D5 (CDN allowlist, MIME/size verification, sanitized `tracking_id` path, never execute downloaded content) are design requirements and MUST propagate to tasks unchanged.

## Migration / Rollout

No migration. Rollback = git revert (restores `web-demo.html` + prior Paso 4), then re-run `skills/setup.sh`.

## Open Questions

None.
