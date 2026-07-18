# Delta for prospeccion-demo-integration

> Out of scope (per proposal): no redesign of `diagnostico.html` / `roi.html`, no
> cleanup of old demos in `tracking/demos-publicar/`, no changes to `worker.js`,
> `wrangler.toml`, or `setup.sh` mechanics.

## ADDED Requirements

### Requirement: Paso 4 Delegates the Web-Demo Asset

`skills/prospeccion/SKILL.md` Paso 4 MUST delegate the web-demo asset branch to the
`demo-landing` skill instead of copying `web-demo.html`. The diagnostico and roi asset
branches MUST remain unchanged.

#### Scenario: Web-demo branch delegates

- GIVEN a top-10 prospect selected for a web demo
- WHEN Paso 4 runs
- THEN it invokes `demo-landing` to generate the landing
- AND the diagnostico/roi asset branches are untouched

### Requirement: Old Template Removed and Documented

`tracking/plantillas-valor/web-demo.html` MUST be deleted, and
`tracking/plantillas-valor/README.md` MUST note its replacement by `demo-landing`.

#### Scenario: Template deleted and noted

- GIVEN the change is applied
- WHEN the repo is inspected
- THEN `web-demo.html` no longer exists
- AND the README notes `demo-landing` as its replacement

### Requirement: Preserved Naming and Tracking Convention

Generated demos MUST keep the `[tracking_id].html` output name under
`tracking/demos-publicar/` and the existing pixel/CTA convention. When `worker_url` is
empty, demos MUST be produced untracked (existing convention).

#### Scenario: Naming preserved

- GIVEN a demo for `tracking_id` `contadores-cdmx-01`
- WHEN it is written
- THEN the file is `tracking/demos-publicar/contadores-cdmx-01.html`

#### Scenario: Untracked when worker_url empty

- GIVEN `worker_url` is empty in `tracking/config.json`
- WHEN demos are generated
- THEN they are produced without tracking, per existing convention
