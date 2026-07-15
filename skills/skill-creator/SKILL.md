---
name: skill-creator
description: "Trigger: create skill, update skill, agent instructions, local skill authoring. Write LLM-first PGIM project skills."
license: Apache-2.0
metadata:
  author: Estrateg IA Hyper
  version: "1.0"
---

## Activation Contract

Use this skill when creating or updating local PGIM skills under `skills/`, including `SKILL.md`, optional references, examples, assets, and skill templates.

Do not use it to edit generated agent folders or external skill installations.

## Hard Rules

- A skill is an LLM runtime contract, not a tutorial or full human manual.
- A local skill normally contains `SKILL.md` plus optional `references/`, `examples/`, and `assets/`.
- Do not create internal `AGENTS.md` files inside skills; root `AGENTS.md` is the single project-level policy.
- Preserve `skills/setup.sh`; it is the canonical sync/link/distribution mechanism.
- Remove inherited external-project content when it conflicts with PGIM policy.
- Keep skill bodies concise and action-oriented; move long examples, schemas, or templates into supporting directories.
- Do not invent missing skills or registry changes unless the user explicitly asks.

## Decision Gates

| Need | Action |
| --- | --- |
| Runtime behavior the LLM must follow | Put it in `SKILL.md`. |
| Long conceptual detail or local docs | Put it in `references/`. |
| Templates, schemas, fixtures, or reusable snippets | Put them in `assets/`. |
| Worked examples | Put them in `examples/`. |
| Project-wide policy | Keep it in root `AGENTS.md`, not inside a skill. |
| Syncing/linking/distribution | Defer to `skills/setup.sh`; do not duplicate the mechanism. |

## Execution Steps

1. Confirm the requested skill belongs under `skills/` and is not generated or external content.
2. Check whether the skill already exists before creating a new directory.
3. Create or update `SKILL.md` with frontmatter and these sections: Activation Contract, Hard Rules, Decision Gates, Execution Steps, Output Contract, References.
4. Use a one-line YAML-safe `description` that starts with trigger words and states what the skill does.
5. Keep the main file focused on decisions and actions an LLM must execute during work.
6. Add optional `references/`, `examples/`, or `assets/` only when they reduce the main file size or preserve reusable material.
7. Review changes with a scoped diff such as `git diff -- skills/{skill-name}`; do not run app builds or tests for skill-only edits.

## Frontmatter Shape

```markdown
---
name: {skill-name}
description: "Trigger: {words users or agents will say}. {What this skill makes the LLM do}."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---
```

## Output Contract

Return:
- Files created or modified.
- Whether any supporting `references/`, `examples/`, or `assets/` were added or updated.
- Confirmation that no skill-local `AGENTS.md` was created.
- Confirmation that `skills/setup.sh` was preserved unless the user explicitly requested a change.
- Follow-up risks or missing skills, without creating them automatically.

## References

- `assets/SKILL-TEMPLATE.md` — local template for PGIM LLM-first skills.
- Root `AGENTS.md` — project-level policy; do not duplicate it inside skills.
