---
name: writing-plans
description: "Use when you have a spec or requirements for a multi-step task, before touching code. Takes requirements and produces an implementation plan with exact file paths, code, and commands."
---

# Writing Implementation Plans

## Overview

Turn requirements into a concrete implementation plan. The plan should be detailed enough that a fresh agent with no context can pick up any task and execute it. Exact file paths, clear descriptions of intent, exact commands.

**Input:** A spec from brainstorming (`docs/specs/`), a GitHub issue, or clear requirements from the user.

**Output:** A plan saved to `docs/plans/YYYY-MM-DD-<feature-name>.md`.

## Phase 1: Implementation Questions

Before writing the plan, understand how the work should be structured. Use `AskUserQuestion` with multiple choice options where possible.

**Questions to ask (adapt to context):**

- **Execution strategy:** Agent team (parallel workers with shared task list), independent subagents (parallel but isolated), or serial/incremental (one step at a time)?
  - Default recommendation: Agent team for 3+ independent tasks, serial for tightly coupled work
- **Testing approach:** TDD (test first), test after, or no tests for this work?
- **Commit strategy:** Commit per task, commit per logical group, or single commit at the end?
- **Branch strategy:** Feature branch, worktree, or work directly on current branch?
- **Existing patterns:** Are there similar features in the codebase to follow as a template?
- **Risk areas:** Anything fragile or tricky the plan should be careful around?

## Phase 2: Explore the Codebase

Before writing the plan, understand what exists:

- Read the spec/requirements thoroughly
- Find existing patterns and conventions in the codebase
- Identify files that will need to be created or modified
- Check for existing tests to understand testing patterns
- Note any dependencies or constraints

## Phase 3: Write the Plan

### Plan Header

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Spec:** [Link to spec if one exists]
**Execution:** [Agent team / Subagents / Serial]
**Branch:** [Branch strategy]

---
```

### Task Structure

Each task should be independently executable. For agent team / subagent execution, identify which tasks can run in parallel vs which have dependencies.

```markdown
### Task N: [Descriptive Name]

**Dependencies:** [Task numbers this depends on, or "None"]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts`
- Test: `tests/exact/path/to/test.ts`

**Steps:**

1. [Clear description of what to do and why]

2. [Next action]

**Verify:** [Exact command to run and expected result]

**Commit:** `feat: descriptive message`
```

### Task Granularity

Each task should be a coherent unit of work — not so small it's trivial, not so large it's hard to review. A good task:

- Has a clear "done" state
- Can be verified independently
- Takes a focused agent 5-15 minutes
- Results in a meaningful commit

### Parallelism

When the execution strategy involves parallel work:

- Clearly mark task dependencies in each task header
- Group independent tasks that can run simultaneously
- Put shared infrastructure (types, interfaces, config) in early tasks that others depend on
- Note any shared state or files that could cause merge conflicts

## Key Principles

- **Describe intent, not code** — Explain what each step should accomplish and why, but don't write the full implementation in the plan. The implementing agent will write the code. Duplicating it here wastes tokens.
- **Exact file paths** — Every file referenced must have its full path
- **Exact commands** — Every verification step has a runnable command and expected output
- **Clarity over cleverness** — 10 lines of readable code is better than 2 lines of clever hacker nonsense. When describing approaches, favor straightforward implementations.
- **DRY / YAGNI** — Don't plan for hypothetical future requirements
- **Dependencies explicit** — If task 3 needs task 1's output, say so

**Next:** Use the executing-plans skill to implement this plan.
