---
name: code-review
description: "Use when requesting or receiving code review — after completing a feature, before merging, or when acting on review feedback."
---

# Code Review

## Requesting Review

### When to Request

- After completing a major feature or task group
- Before merging into the main branch
- After fixing a complex bug
- When stuck and wanting a fresh perspective

### How to Request

Dispatch a code-reviewer agent with:

- **What was implemented** — brief description
- **Requirements or plan** — what it should do, or a link to the spec/plan
- **Git range** — base and head commits so the reviewer can diff
- **Verification status** — did tests pass? Build clean?

The reviewer will categorize issues by severity (critical, important, minor) and give a merge readiness assessment.

### Acting on Feedback

- **Critical issues** — fix before proceeding
- **Important issues** — fix before merging
- **Minor issues** — use judgment, fix or note for later
- **Disagree with feedback** — push back with technical reasoning

## Receiving Review

### Before Implementing Feedback

1. **Read all feedback first** — don't start fixing item 1 before understanding the full picture. Items may be related.
2. **Verify against the codebase** — is the suggestion actually correct for this project? Check before assuming.
3. **Clarify anything unclear** — if you don't fully understand an item, ask before implementing. Partial understanding leads to wrong implementations.
4. **Check for YAGNI** — if a reviewer suggests adding something, check whether it's actually needed. Grep for usage. Don't add features nobody calls.

### When to Push Back

Push back when:
- The suggestion breaks existing functionality
- The reviewer lacks full context about why something was done a certain way
- It violates YAGNI — adding unused features
- It's technically incorrect for this stack or project
- It conflicts with prior architectural decisions

Push back with technical reasoning, not defensiveness. Reference specific code, tests, or decisions. If it's an architectural disagreement, involve the user.

### Implementation Order

When addressing multiple review items:
1. Clarify anything unclear first
2. Blocking issues (breaks, security)
3. Simple fixes (typos, imports, naming)
4. Complex fixes (refactoring, logic changes)
5. Test each fix individually, verify no regressions

### When You Were Wrong

If you pushed back and the reviewer was right, acknowledge it factually and implement the fix. No need for lengthy explanations.
