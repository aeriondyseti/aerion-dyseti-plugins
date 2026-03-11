---
name: agent-orchestration
description: "Use when deciding how to structure work across agents — choosing between agent teams, subagents, or serial execution, and writing effective agent prompts."
---

# Agent Orchestration

## Overview

Guide for deciding when and how to delegate work to other agents, and how to communicate with them effectively. The goal is maximum parallelism with minimum wasted tokens.

## When to Use What

### Agent Teams (TeamCreate + teammates)

Use when tasks need **coordination** — shared task lists, message passing, dynamic work assignment.

- 3+ tasks with dependencies between them
- Work where one agent's output feeds into another's
- Long-running efforts where tasks get unblocked over time
- Situations where you need to reassign work or respond to blockers

**Team lead stays lightweight.** The lead orchestrates — it creates tasks, assigns work, resolves blockers, and reviews. It should not be doing implementation work itself unless the team is idle.

### Independent Subagents (Task tool)

Use when tasks are **fully independent** — no shared state, no coordination needed.

- Research queries that don't affect each other
- File changes in completely separate areas of the codebase
- One-off tasks where you need the result and nothing else
- Exploratory work (codebase search, reading docs)

### Serial (do it yourself)

Use when work is **tightly coupled** or **trivial**.

- Each step depends on the previous step's output
- The task is small enough that spawning an agent is overhead
- You need to maintain a chain of reasoning across steps
- Fewer than 3 steps total

## Writing Agent Prompts

The most important skill in orchestration is writing good prompts for the agents you spawn.

### Provide Context by Reference, Not by Value

Agents will read files themselves. Don't paste file contents into prompts — point them to the files.

**Do:**
> Modify `src/auth/login.ts` to add rate limiting to the `handleLogin` function. Follow the same pattern used in `src/auth/register.ts`.

**Don't:**
> Here is the contents of login.ts: [500 lines of code]. Modify it to add rate limiting. Here is register.ts for reference: [300 lines of code].

**Exception:** If you've already parsed and extracted information (e.g., a specific task from a plan file), provide that directly. Don't make the agent re-read and re-parse a document you've already processed.

### Minimum Viable Context

Every token in a prompt that the agent doesn't need is waste. Include:

- **What** to do — the specific task
- **Where** to do it — exact file paths
- **Why** if it's not obvious — enough intent to make good judgment calls
- **How to verify** — the command to run when done
- **Patterns to follow** — point to an existing file as a template, don't describe the pattern

Don't include:
- Broad project background the agent doesn't need for this task
- Contents of files the agent can read itself
- Instructions for other tasks
- Caveats about things that aren't relevant to this specific task

### Be Specific About the Deliverable

Tell the agent exactly what "done" looks like:

- Which files should exist or be modified when done
- What command to run to verify
- Whether to commit, and with what message
- What to report back

### One Task Per Agent

Don't give an agent a grab bag of loosely related work. If you have 3 tasks, spawn 3 agents. Each agent should have a single clear objective.

## Team Sizing

- **2-4 teammates** is the sweet spot for most work
- Match teammates to parallel tracks, not to task count — an agent can work through a sequence of tasks
- Don't spawn agents that will sit idle waiting for dependencies
- Spawn more agents when new parallel tracks open up, not all at the start

## Model Selection

Use cheaper, faster models for worker agents when the task is straightforward. Reserve the most capable model for orchestration and complex reasoning:

- **Worker agents** (implementation, file changes, test fixes) — Haiku or Sonnet is usually sufficient
- **Orchestrator** (planning, reviewing, resolving conflicts) — use the current model
- **Code review** — Sonnet or higher, since review quality matters

## Workspace Isolation

When agents need to work on the same repo without conflicting, use worktrees:

- The Task tool supports `isolation: "worktree"` to give an agent its own copy of the repo automatically
- For manual worktree setup, verify the worktree directory is gitignored before creating it (`git check-ignore -q <dir>`). If it's not ignored, add it to `.gitignore` first — prevents accidentally committing worktree contents.
- After creating a worktree, run project setup (dependency install) and verify the test baseline is clean before starting work. If tests are already failing, flag it to the user — you need a clean baseline to know if your changes break something.

## Failure Handling

**One attempt, then escalate.** The orchestrator should make a single best-effort attempt to resolve an issue. If it's not resolved within a few messages, stop and bring the user in. Burning tokens on retry loops is worse than asking for help.

- If a subagent fails, read its output to understand what went wrong. Try once to fix or re-dispatch. If that doesn't work, escalate to the user.
- If a teammate is stuck or asks a question, answer clearly and completely before expecting them to proceed. If they're still stuck after that, escalate.
- If parallel agents produce conflicting changes, make one attempt to resolve the conflict yourself. If it's not straightforward, escalate.
- Never retry the same failing approach. If the first fix didn't work, the user needs to weigh in.
