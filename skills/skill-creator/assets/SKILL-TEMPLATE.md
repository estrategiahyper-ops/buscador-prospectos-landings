---
name: {skill-name}
description: "Trigger: {words users or agents will say}. {What this skill makes the LLM do}."
license: Apache-2.0
metadata:
  author: Estrateg IA Hyper
  version: "1.0"
---

## Activation Contract

Use this skill when {specific task, file context, or user request that should load it}.

Do not use this skill when {nearby but out-of-scope task}.

## Hard Rules

- {Non-negotiable rule the LLM must follow.}
- {Project convention or safety constraint.}
- {What not to create, modify, or assume.}

## Decision Gates

| Situation | Action |
| --- | --- |
| {Condition A} | {Action A} |
| {Condition B} | {Action B} |
| {Unclear or risky condition} | Ask one focused question or stop for review. |

## Execution Steps

1. {Inspect the local context needed before acting.}
2. {Apply the smallest correct change.}
3. {Preserve project conventions and generated mechanisms.}
4. {Run only safe, relevant checks.}

## Output Contract

Return:
- Files created or modified.
- Decisions made and why.
- Checks run.
- Follow-up risks or work intentionally left out.

## References

- Root `AGENTS.md` — project-level policy; do not duplicate it inside skills.
- `{optional local reference}` — {why it matters}.
