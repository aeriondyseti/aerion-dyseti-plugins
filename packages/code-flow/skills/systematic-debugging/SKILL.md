---
name: systematic-debugging
description: "Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes."
---

# Systematic Debugging

## Overview

Find the root cause before attempting fixes. Random fixes waste time and create new bugs.

**Core principle:** If you don't understand why something is broken, you can't fix it reliably.

## Phase 1: Understand the Problem

**Before attempting ANY fix:**

1. **Read error messages carefully** — don't skip past them. Stack traces, line numbers, error codes often contain the answer.

2. **Reproduce consistently** — can you trigger it reliably? What are the exact steps? If it's not reproducible, gather more data before guessing.

3. **Check recent changes** — what changed? Git diff, recent commits, new dependencies, config changes, environmental differences.

4. **Trace to root cause** — bugs manifest deep in the call stack but originate elsewhere. Don't fix where the error appears; trace backward to the source:
   1. Observe the symptom — what error, where?
   2. Find the immediate cause — what code directly produces this error?
   3. Ask "what called this?" — trace one level up the call chain
   4. Keep tracing up — what value was passed? Where did it come from?
   5. Find the original trigger — the first point where things went wrong
   6. Fix at the source, not the symptom

   When you can't trace manually, add instrumentation: log inputs and stack traces at the point of failure, run once, then follow the trail.

5. **Gather evidence in multi-component systems** — before proposing fixes, add diagnostic logging at each component boundary. Run once to see WHERE it breaks, then investigate that specific component.

## Phase 2: Form Hypotheses

1. **Find working examples** — locate similar working code in the codebase. What's different between working and broken?

2. **List plausible hypotheses** — state each clearly: "I think X is the root cause because Y." Be specific.

3. **Prioritize by likelihood** — which hypothesis has the most evidence? Which is easiest to test?

## Phase 3: Test Hypotheses

### Single hypothesis

Make the smallest possible change to test it. One variable at a time. Verify before continuing.

### Multiple plausible hypotheses

When you have 2-3 hypotheses with similar likelihood, test them in parallel:

- Dispatch agents to investigate each hypothesis simultaneously
- Each agent gathers evidence for or against its hypothesis
- Reconvene results and identify the root cause
- This is investigation, not fixing — agents are gathering evidence, not making changes

### When a hypothesis is wrong

Don't add more fixes on top. Form a new hypothesis based on what you learned.

## Phase 4: Fix

1. **Fix the root cause** — not the symptom. One change at a time. No "while I'm here" improvements.

2. **Verify the fix** — does the issue resolve? Are other things still working? Is the output clean?

3. **Harden with defense-in-depth** — after fixing, add validation at every layer the data passes through to make the bug structurally impossible. A single check can be bypassed by different code paths or refactoring. Validate at:
   - **Entry points** — reject invalid input at API/function boundaries
   - **Business logic** — ensure data makes sense for the operation
   - **Environment guards** — prevent dangerous operations in specific contexts (e.g., test vs production)
   - **Instrumentation** — log context before risky operations for future debugging

   Not every fix needs all four layers. Use judgment — the goal is "this class of bug can't happen again," not ceremony.

4. **If the fix doesn't work** — stop. Return to Phase 1 with the new information. Don't stack more attempts.

5. **If 3+ fixes have failed** — stop and question the architecture. Multiple failed fixes suggest the problem is structural, not a simple bug. Discuss with the user before continuing.

## Red Flags — Stop and Reassess

- "Just try changing X and see if it works"
- "Quick fix for now, investigate later"
- Proposing solutions before understanding the data flow
- Making multiple changes at once
- Each fix reveals a new problem in a different place
- "One more attempt" after 2+ failures

**All of these mean: stop, go back to Phase 1.**

## Quick Reference

| Phase | Key Activity | Done When |
|-------|-------------|-----------|
| **1. Understand** | Read errors, reproduce, trace data flow | You know WHAT and WHERE |
| **2. Hypothesize** | Find working examples, list causes | You have specific theories |
| **3. Test** | Minimal changes, parallel investigation | You know WHY |
| **4. Fix** | Single root-cause fix, verify | Bug resolved, nothing else broken |
