---
name: verification-before-completion
description: "Use when about to claim work is complete, fixed, or passing — before committing, creating PRs, or reporting success."
---

# Verification Before Completion

## Overview

Before claiming work is done, verify that it's actually done. Run the commands, read the output, check the edges.

**Core principle:** Evidence before claims.

## The Checklist

Before saying "done," walk through these questions:

### 1. Did you finish the actual task?

- Re-read the original requirements or spec
- Check each acceptance criterion or requested change — did you address all of them, or just most?
- Did you handle edge cases, or only the happy path?

### 2. Does it work?

- Run the relevant verification commands (tests, build, linter, type checker)
- Read the full output — don't skim. Check exit codes, failure counts, warnings.
- If there's no automated verification, describe how you tested it manually

**The claim must match the evidence.** If tests show 33/34 passing, don't say "all tests pass."

### 3. Did you break anything else?

- Run the full test suite, not just the tests for your changes
- Check that existing functionality still works
- Look for warnings or deprecation notices that weren't there before

### 4. Is there non-code work to do?

Not every task needs all of these, but consider each one:

- **Documentation** — does the change need docs updates? README, API docs, inline comments for non-obvious logic?
- **Configuration** — any config files, environment variables, or settings that need updating?
- **Tests** — should new tests be written to cover the changes? Are existing tests still appropriate?
- **Migration** — does this require data migration, schema changes, or deployment steps?

If the task is purely exploratory (reading code, researching), skip this section.

### 5. State what you verified

When reporting completion, include what you ran and what the output was. Not "tests pass" — instead, "ran `npm test`, 47/47 passing, 0 warnings."

## What This Doesn't Apply To

- Exploring the codebase
- Answering questions
- Research tasks
- Providing recommendations

This is for tasks that produce changes — code, config, docs.

**Next:** Use the finishing-a-development-branch skill to decide how to integrate the work.
