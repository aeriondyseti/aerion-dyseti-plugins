---
name: finishing-a-development-branch
description: "Use when implementation is complete and you need to decide how to integrate the work — merge, PR, or cleanup."
---

# Finishing a Development Branch

## Overview

When implementation is done, verify everything works and help the user decide what to do with the branch.

## Step 1: Verify Before Anything Else

Run the full test suite, build, and any other project-level checks. Read the output.

**All tests must pass before proceeding.** This includes tests that seem unrelated to your changes. If a test was passing before your branch and is failing now, your work introduced the failure — even if the connection isn't obvious. Investigate it.

If a test was *already* failing before your branch (verifiable via the base branch), flag it to the user explicitly: "This test was already failing on main. Here's the evidence: [command/output]. Want to proceed anyway?" Don't silently skip it.

## Step 2: Ask What to Do

Use `AskUserQuestion` to present the options:

- **Merge locally** — merge into the base branch, delete the feature branch
- **Create a Pull Request** — push and open a PR
- **Keep the branch** — leave it as-is for later
- **Discard** — delete the branch and its changes (confirm before executing)

## Step 3: Execute and Clean Up

Follow the user's choice. If discarding, confirm first — list what will be deleted. If merging, run the test suite again on the merged result before finishing.

Clean up any worktrees or temporary branches that are no longer needed.
