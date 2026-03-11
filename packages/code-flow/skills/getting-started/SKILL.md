---
name: getting-started
description: "Use at the start of every conversation and when deciding how to approach a task. Routes to the appropriate thinking skill based on what the user is asking for."
---

# Getting Started

These skills represent how I expect work to be done. They are not optional — check for a matching skill before starting any task, and invoke it if one applies.

## Skill Map

| Situation | Skill | Why |
|-----------|-------|-----|
| New feature, new idea, creative work | **brainstorming** | Discover requirements before building |
| Have requirements, need a plan | **writing-plans** | Turn specs into actionable task breakdowns |
| Have a plan, ready to build | **executing-plans** | Orchestrate parallel or serial execution |
| Delegating work to agents | **agent-orchestration** | Choose the right agent strategy, write good prompts |
| Bug, test failure, unexpected behavior | **systematic-debugging** | Find root cause before fixing |
| About to say "done" | **verification-before-completion** | Run the checks, read the output, then claim it |
| Implementation complete, what now? | **finishing-a-development-branch** | Verify, then decide: merge, PR, keep, or discard |
| Requesting or receiving code review | **code-review** | How to ask for review and how to act on feedback |

## Priority

When multiple skills could apply, process skills come first:

1. **Thinking skills** (brainstorming, debugging) — these determine how to approach the problem
2. **Execution skills** (writing-plans, executing-plans) — these guide how to do the work
3. **Completion skills** (verification, finishing, code-review) — these ensure quality at the end

## How Skills Work Together

A typical feature flow:

1. **brainstorming** — understand what to build, produce a spec
2. **writing-plans** — turn the spec into tasks with dependencies
3. **executing-plans** + **agent-orchestration** — dispatch agents to build it
4. **code-review** — review the implementation against requirements
5. **verification-before-completion** — verify everything works
6. **finishing-a-development-branch** — merge, PR, or clean up

Not every task hits every skill. A bug fix might only need systematic-debugging → verification. A quick change might skip straight to verification. Use judgment — but default to using the skill if there's any doubt.
