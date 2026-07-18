# Tasks: demo-page-skill — Personalized Demo Landing Skill

Req tags → spec: R1 Real-Data-Only, R2 Required Sections, R3 Brand Palette, R4 Self-Contained Assets, R5 Tracking/CTA, R6 Maqueta/Credit, R7 Rubric, R8 Fix Loop, R9 Screenshot/Degraded, R10 Paso4 Delegates, R11 Template Removed, R12 Preserved Naming. No test runner → verification = checklist substitute (file check, HTML inspection, playwright-cli screenshots 320/768/1024). Skill copy is Spanish (usted).

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~820 (SKILL.md ~150 + 3 refs ~460 + prospeccion edit ~40 + README ~15 + web-demo.html deletion 157) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (demo-landing skill) → PR 2 (integration + cleanup + acceptance) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main (proposed; slices land independently) |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | New `demo-landing` skill (SKILL.md + 3 refs) | PR 1 | `git diff --stat -- skills/demo-landing/` | Generate id:1 sample from prospectos-contadores-cdmx.json + rubric | `rm -r skills/demo-landing/`; nothing else references it yet |
| 2 | prospeccion delegates + web-demo.html removed + README + acceptance | PR 2 | `git diff --stat -- skills/prospeccion tracking/plantillas-valor` | Acceptance dry-run id:1 & id:2 via Paso 4 delegation + rubric | `git revert` restores web-demo.html + prior Paso 4; re-run setup.sh |

## Phase 1: demo-landing skill core (PR 1)

- [x] 1.1 Create `skills/demo-landing/SKILL.md` (skill-creator sections: Activation Contract, Hard Rules, Decision Gates, Execution Steps generate→review→fix, Output Contract, References). Pin invocation input/output YAML + `resumen` {paleta, imagenes, revision, iteraciones}; CTA/tracking rules (D8: `/c` wraps only http(s) ids `[tracking_id]-demo-wa`; `tel:`/`mailto:` direct; pixel `p?id=[tracking_id]-demo`; `worker_url` empty → untracked). [D1,R5,R12,D8] Verify: `fd SKILL.md skills/demo-landing`.
- [x] 1.2 In SKILL.md pin the VERBATIM credit "generada con un proceso totalmente automatizado por el equipo de Estrateg IA Hyper" and maqueta/propuesta framing (never "publicado"). [R6, validator A]
- [x] 1.3 Create `references/mapeo-datos.md`: section→field table (navbar/hero/about/why-us/services/FAQ/footer); Tier A verbatim + omit-if-null, Tier B sector-typical; prohibit testimonials, stat bars, invented hours/prices, and stats contradicting JSON (no "HTTPS" when https:false). Pin: `notas` is seller-internal, NEVER rendered; NEVER include side-by-side screenshots of the prospect's current site. [R1,R2,D2, validator C]
- [x] 1.4 Create `references/diseno-visual.md` palette section: ui-ux-pro-max `--design-system "{sector} {tono} landing"` (one/sector, no `--persist`); WebFetch site+CSS only if `tiene_web`, filter grays/near-white/black, gate = ≥2 distinct usable brand colors; text stays neutral unless 4.5:1 vs brand background (luminance table); fallback → sector palette and record `paleta: marca|sector` in campaign report. [R3, validator B, D3,D4]
- [x] 1.5 In diseno-visual.md add image pipeline + file shape: WebSearch CC0 → `curl -L` only from images.pexels.com/images.unsplash.com → `assets/[tracking_id]/` (sanitize `[a-z0-9-]+`) → verify MIME image/* + 10KB–1.5MB, 2 attempts → gradient/SVG fallback; relative paths, system-font stacks (no Google Fonts), never execute downloads; single-file inline CSS/JS ≤~60 lines, `<details>` FAQ, transform/opacity + prefers-reduced-motion, 16px base, 44px targets, lang="es-MX", real alt, loading=lazy, width/height. [R4,D5,D6]
- [x] 1.6 Create `references/revision.md`: rubric axes datos (binary, all pass)/responsive/utilidad at 320/768/1024; playwright-cli resize+screenshot+eval `scrollWidth ≤ innerWidth`+console, screenshots in session temp dir NEVER in demos-publicar/; ≤2 fix iterations then flag `revision-manual`; no playwright → static checklist, flag `solo-checklist`, record mode used. [R7,R8,R9,D7]
- [x] 1.7 Re-run `skills/setup.sh`; verify `.claude/skills/demo-landing/SKILL.md` resolves.
- [x] 1.8 PR1 verify: `git diff --stat -- skills/demo-landing/` → 4 files, Spanish/usted, all D1–D9 rules present; skill-only, no build/test (skill-creator rule).
- [ ] 1.9 Replace the credit line with the D10 sello block: canonical headline "Generada de forma 100% automatizada por Estrateg IA Hyper" + supporting line (flujos de trabajo, escenarios con agentes de IA, automatización de tareas manuales con software e IA); distinctive footer styling adapting to each page's palette and footer design; update revision.md datos check accordingly. [R6 updated, D10]
- [ ] 1.10 Pin the generation model: SKILL.md code-writing step delegates to a sub-agent with model `sonnet` (Claude Sonnet 5); add `modelo` to the resumen Output Contract (substitute recorded if alias unavailable). [D11]

## Phase 2: prospeccion integration + cleanup (PR 2)

- [ ] 2.1 Edit `skills/prospeccion/SKILL.md` Paso 4 (lines 155–176): web-demo bullet → "usa la skill `demo-landing`"; re-scope "Trust & Authority" paragraph to diagnostico/roi only; split flujo step 1 per asset type; keep deploy/CTA/pixel steps + top-10 selection unchanged. [R10,D9]
- [ ] 2.2 Delete `tracking/plantillas-valor/web-demo.html`. Verify: `fd web-demo.html` returns nothing. [R11]
- [ ] 2.3 Edit `tracking/plantillas-valor/README.md`: replace web-demo.html row/refs with demo-landing replacement note; keep diagnostico/roi rows; confirm docs preserve `tracking/demos-publicar/[tracking_id].html` naming + untracked-when-`worker_url`-empty. [R11,R12,D9]
- [ ] 2.4 Re-run `skills/setup.sh` after integration edits.
- [ ] 2.5 PR2 verify: `git diff --stat -- skills/prospeccion tracking/plantillas-valor` → delegation wording, deletion, README note; diagnostico/roi untouched.

## Phase 3: acceptance dry-run (final gate)

- [ ] 3.1 Generate sample for id:1 (con web → brand path) from `prospectos-contadores-cdmx.json` via Paso 4 delegation: expect 7 sections, `paleta: marca` (or noted fallback), local assets, verbatim credit + maqueta framing, correct pixel/CTA per config. [R1–R6,R12]
- [ ] 3.2 Generate sample for id:2 (sin web, null email/whatsapp → fallback path): expect sector palette, null-field blocks omitted (no placeholders), gradient/SVG fallback if images fail. [R1,R3,R4]
- [ ] 3.3 Run review loop on both: playwright screenshots 320/768/1024 + rubric, or checklist-only if absent (record `solo-checklist`); confirm ≤2 fix iterations else `revision-manual`. [R7,R8,R9]
- [ ] 3.4 Acceptance: both demos meet proposal success criteria (self-contained — only external request = tracking worker; every claim traces to JSON; pixel/CTA correct); campaign report shows palette-fallback + revision flags. [all]
