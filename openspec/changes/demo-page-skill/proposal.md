# Proposal: demo-page-skill — Personalized Demo Landing Skill

## Intent

The current web-demo asset flow (`skills/prospeccion/SKILL.md:155-176` + `tracking/plantillas-valor/web-demo.html`) substitutes 3 tokens into one fixed navy template: demos look generic, rich collected data (problemas_detectados, oportunidades, redes, email/whatsapp) goes unused, and hardcoded stats can contradict the real analysis. Replace it with a new project skill, **`demo-landing`**, that generates a personalized, modern landing-page demo per prospect from their real data, with a built-in generate → review → fix quality loop before a demo is accepted.

## Scope

### In Scope
- New skill `skills/demo-landing/SKILL.md` (Spanish, skill-creator standard, optional `assets/`/`references/`; no skill-local CLAUDE.md/AGENTS.md)
- Generation from real prospect JSON only, vanilla HTML/CSS/JS: navbar, hero, about, why-us, services, FAQ, footer; animations + gradients + images
- Brand-first palette (extracted from prospect's site) with sector/giro fallback via ui-ux-pro-max
- Local CC0 photos downloaded per demo into `tracking/demos-publicar/assets/[tracking_id]/` — self-contained `npx wrangler pages deploy`
- Keep `[tracking_id].html` naming + tracking pixel/CTA convention (`worker_url` from `tracking/config.json`); "maqueta/propuesta" framing; distinctive Estrateg IA Hyper sello in the footer (fully automated process + breadth of automation services: workflows, agentic scenarios, manual-task automation), short copy adapted to each footer design
- Landing code generation delegated to a sub-agent pinned to model `sonnet` (Claude Sonnet 5) so demo output stays comparable and measurable across campaigns
- Review loop (rubric below) before a demo is accepted
- Integrate into `skills/prospeccion/SKILL.md` Paso 4 (web-demo branch delegates to new skill); delete `web-demo.html`
- Improvements: problemas_detectados/oportunidades become real why-us/services copy; WhatsApp/email CTAs from collected data, click-tracked

### Out of Scope
- Redesigning `diagnostico.html` / `roi.html`; cleaning old demos in `tracking/demos-publicar/` (separate later changes)
- Changes to worker.js, wrangler.toml, setup.sh mechanics

## Capabilities

### New Capabilities
- `demo-landing-generation`: prospect-data → landing-page contract (sections, palette, images, tracking, framing, credit)
- `demo-quality-review`: generate → review → fix rubric (data correctness, responsive breakpoints, client usefulness) and iteration policy
- `prospeccion-demo-integration`: how prospeccion Paso 4 delegates the web-demo asset to `demo-landing`

### Modified Capabilities
None — `openspec/specs/` is empty.

## Approach — Design Positions

| Question | Position | Tradeoff |
|---|---|---|
| Review loop | playwright-cli screenshots at 320px + 768px + 1024px + rubric; ≤2 fix iterations then flag manual; checklist-only if playwright absent | Slower per demo, but catches responsive breakage checklists miss |
| Brand colors | WebFetch prospect CSS/HTML → dominant colors; require ≥2 usable + 4.5:1 contrast, else ui-ux-pro-max sector palette; every fallback is noted in the campaign report | Heuristic extraction can misfire; contrast gate + noted fallback bounds it |
| CC0 images | Search + curl download → verify MIME/size → gradient/SVG fallback | Never ships broken images; fallback demo is plainer |
| Old template | Delete `web-demo.html` and its flow references; README notes the replacement | Cleaner repo, zero accidental-reuse risk; rollback recovers the file via git revert |
| Beats their site | Implicit comparison: why-us built from recorded problemas; no side-by-side screenshots | Avoids adversarial tone/copyright; less dramatic contrast |

## Affected Areas

| Area | Impact |
|---|---|
| `skills/demo-landing/` | New |
| `skills/prospeccion/SKILL.md` (155-176) | Modified |
| `tracking/plantillas-valor/README.md` | Modified (replacement note) |
| `tracking/plantillas-valor/web-demo.html` | Deleted |
| `tracking/demos-publicar/assets/` | New per-demo folders |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Wrong brand colors extracted | Med | Contrast gate + sector fallback |
| Image download failures | Med | Verify file; gradient/SVG fallback |
| Review loop time × 10 demos | Med | ≤2 iterations, then manual flag |
| Invented content creep | Med | Rubric: every claim maps to a real JSON field |

## Rollback Plan

Git revert the change commits — this restores the deleted `web-demo.html` and the prior prospeccion Paso 4 section, fully reinstating the old flow. Re-run `skills/setup.sh` after revert.

## Dependencies

- ui-ux-pro-max skill (palettes/design system queries)
- playwright-cli skill (review screenshots; degraded checklist mode if absent)
- `tracking/config.json` `worker_url` (empty → untracked demos, existing convention)

## Success Criteria

- [ ] `skills/demo-landing/SKILL.md` exists (Spanish, skill-creator sections); `skills/setup.sh` re-run
- [ ] Sample demo has all 7 sections, brand/sector palette, local images, animations; passes rubric at 320px, 768px and 1024px
- [ ] Every rendered claim traces to real JSON data; credit + maqueta framing present; pixel/CTA URLs correct
- [ ] Deployed demo is self-contained (only external request = tracking worker)
- [ ] prospeccion delegates the web-demo asset to the new skill; `web-demo.html` deleted
