# Delta for demo-quality-review

> Verification note: this project has NO test runner. Every scenario below is
> verifiable via the documented checklist substitute — HTML inspection,
> playwright-cli screenshots, and file checks — not unit tests.

## ADDED Requirements

### Requirement: Quality Rubric Gate

A demo MUST pass a rubric before it is accepted, scoring three dimensions: data
correctness (claims match JSON), responsive layout at 320px, 768px, and 1024px, and
client usefulness (the demo advances closing the prospect).

#### Scenario: Demo passes rubric

- GIVEN a generated demo
- WHEN it is reviewed against the rubric
- THEN it is accepted only if all three dimensions pass at all three breakpoints

#### Scenario: Responsive break at 320px

- GIVEN the layout overflows horizontally at 320px
- WHEN reviewed
- THEN the demo fails the rubric and enters the fix loop

### Requirement: Bounded Fix Loop

The review MUST allow at most two fix iterations; if the demo still fails after them, it
MUST be flagged for manual review rather than looping further.

#### Scenario: Fixed within two iterations

- GIVEN a demo failing the rubric
- WHEN a fix is applied and it re-passes within two iterations
- THEN it is accepted

#### Scenario: Manual flag after two iterations

- GIVEN a demo still failing after two fix iterations
- WHEN the loop limit is reached
- THEN it is flagged for manual review and not auto-accepted

### Requirement: Screenshot Verification with Degraded Mode

Review SHOULD use playwright-cli screenshots at the three breakpoints; when playwright is
unavailable it MUST fall back to a checklist-only degraded mode (HTML inspection + file
checks) and record which mode was used.

#### Scenario: Playwright available

- GIVEN playwright-cli is installed
- WHEN a demo is reviewed
- THEN screenshots at 320px/768px/1024px are captured and inspected

#### Scenario: Playwright absent

- GIVEN playwright-cli is unavailable
- WHEN a demo is reviewed
- THEN a checklist-only review runs and the degraded mode is recorded
