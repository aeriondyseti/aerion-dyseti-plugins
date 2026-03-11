---
name: executing-plans
description: "Use when you have a written implementation plan to execute. Orchestrates parallel agent teams, subagents, or serial execution based on the plan's execution strategy."
---

# Executing Plans

## Overview

Take an implementation plan and orchestrate its execution. Read the plan, understand the dependency graph, and dispatch work — preferring parallel execution whenever tasks are independent.

**Input:** A plan from writing-plans (`docs/plans/`) or a plan provided by the user.

## Phase 1: Load and Review

1. Read the plan file thoroughly
2. Map the dependency graph — which tasks block which
3. Identify the first wave of tasks that have no dependencies
4. Review critically: raise any concerns or ambiguities with the user before starting
5. Confirm the execution strategy from the plan header (agent team / subagents / serial)

## Before Each Task: Check Your Understanding

Before starting any task (or dispatching it to an agent), pause and ask: do I have all the information needed to do this well? Specifically:

- Can the task be completed with what's in the plan, or are there gaps?
- Can missing information be acquired with available tools (search the codebase, read files, check symbols)?
- Or do you need to ask the user?

Don't start implementing with incomplete understanding. A few minutes of investigation up front prevents wasted work.

## Phase 2: Execute

### Agent Team (default for 3+ independent tasks)

Use `TeamCreate` to set up a team, then:

1. Create all tasks from the plan using `TaskCreate`, setting up dependency chains with `addBlockedBy`
2. Spawn teammates — one per parallel track of work
3. Assign the first wave of unblocked tasks to teammates
4. As teammates complete tasks, assign newly unblocked tasks
5. Monitor progress via `TaskList` and teammate messages
6. When a teammate hits a blocker, help resolve it or escalate to the user
7. **After each wave completes**, run the `code-simplifier` agent on the modified files to refine code for clarity and consistency before moving to the next wave

**Team sizing:** Match the number of teammates to the number of parallel tracks, not the number of tasks. 2-4 teammates is typical. Don't spawn more agents than you have independent work for.

**Teammate prompts should include:**
- The specific task description from the plan
- Relevant context (file paths, patterns to follow, dependencies that are now complete)
- The verification command to run when done
- Commit instructions

### Independent Subagents (isolated parallel work)

Use the `Task` tool to dispatch subagents for tasks that are fully independent and don't need coordination:

1. Launch subagents for all unblocked tasks in parallel
2. Wait for results
3. Run the `code-simplifier` agent on the modified files to refine code for clarity and consistency
4. Review outputs before moving to the next wave
5. Launch the next wave of unblocked tasks

### Serial (tightly coupled work)

Execute tasks one at a time:

1. Work through tasks in order
2. Run verification after each task
3. Run the `code-simplifier` agent on the modified files to refine code for clarity and consistency
4. Commit after each task (or per the plan's commit strategy)
5. Checkpoint with the user between logical groups

## Phase 3: Review Checkpoints

Regardless of execution strategy, pause for user review at natural boundaries:

- After the first wave of parallel tasks completes
- When a task fails verification or hits an unexpected issue
- At phase boundaries in the plan (e.g., "infrastructure" tasks done, moving to "feature" tasks)
- When making a judgment call not covered by the plan

At each checkpoint:
- Summarize what was completed and what's next
- Show verification results
- Flag anything that deviated from the plan
- Ask: "Ready to continue?"

## When to Stop

**Stop and ask the user immediately when:**
- A task fails verification and the fix isn't obvious
- Two teammates hit a merge conflict or contradictory changes
- The plan has a gap — a task references something that doesn't exist
- You're unsure whether a deviation from the plan is acceptable
- A blocking task is stuck and nothing else can proceed

**Don't guess through ambiguity. Ask.**

## Key Principles

- **Parallel by default** — If tasks don't depend on each other, run them simultaneously
- **Dependencies are the bottleneck** — Focus on unblocking the critical path
- **Fresh agents, full context** — Each agent gets the specific context it needs, not the entire plan
- **Verify before moving on** — Never mark a task done without running its verification step
- **The plan is a guide, not a script** — Agents should understand the intent and implement it well, not mechanically follow pseudo-code

**Next:** Use the verification-before-completion skill before claiming the work is done.
