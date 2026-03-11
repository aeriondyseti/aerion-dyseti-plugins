---
name: checkpoint-get
description: Load project context from checkpoint + git + vector memories
user-invocable: true
disable-model-invocation: true
---

Load context for current project using vector-memory.

## 1. Check Git

```bash
git log --oneline -10 2>/dev/null
git branch --show-current 2>/dev/null
```

## 2. Fetch Checkpoint

Call `mcp__vector-memory__get_checkpoint` to retrieve the latest checkpoint snapshot.

After reading checkpoint, check for staleness:
```bash
git log --oneline --since="[checkpoint date]" 2>/dev/null
```

**If commits exist after checkpoint:** Show them, ask user whether to use checkpoint or skip it.

**If no checkpoint exists:** Note it and continue to step 3.

## 3. Search Memories

Call `mcp__vector-memory__search_memories` with:
- query: "[project name] architecture decisions patterns"
- intent: "continuity"
- reason_for_search: "Loading project context for session resumption"
- limit: 10

## 4. Load Referenced Memories

If the checkpoint includes memory IDs, call `mcp__vector-memory__get_memories` with those IDs to retrieve full context.

## 5. Present Context

```markdown
# Context: [Project]
**Dir:** [path] | **Branch:** [branch] | **Checkpoint:** [date or None]

## Git Activity
[recent commits]

## State
[from checkpoint summary, completed items, blockers]

## Next Steps
[from checkpoint next_steps]

## Relevant Memories
[key memories from search + referenced memories]
```

## 6. Synthesize & Continue

Combine checkpoint document with retrieved memories to establish full context. Then:

1. Briefly acknowledge what was loaded (checkpoint date + number of memories retrieved)
2. Confirm current status and next steps from checkpoint
3. Ask: "Ready to continue with [next step], or is there a different direction?"

**No checkpoint / no memories:** Just note it and ask what we're working on.
