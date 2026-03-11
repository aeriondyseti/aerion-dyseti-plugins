# cc-plugins

Claude Code plugin marketplace by AerionDyseti.

## Install

```bash
/plugin marketplace add AerionDyseti/cc-plugins
```

Then install individual plugins:

```bash
/plugin install vector-memory@cc-plugins
```

## Plugins

### vector-memory

RAG-powered session memory with waypoints for Claude Code. Automatically loads the [vector-memory-mcp](https://github.com/AerionDyseti/vector-memory-mcp) server and adds waypoint commands, workflow skills, and session lifecycle hooks.

**Prerequisites:** [Bun](https://bun.sh/) 1.0+

#### MCP Server (auto-loaded)

| Tool | Description |
|------|-------------|
| `store_memories` | Save memories with metadata |
| `search_memories` | Semantic search with intent-based ranking |
| `get_memories` | Retrieve memories by ID |
| `update_memories` | Modify existing memories |
| `delete_memories` | Soft-delete outdated memories |
| `report_memory_usefulness` | Feedback for search quality improvement |
| `set_waypoint` | Save session state snapshot |
| `get_waypoint` | Restore session state |

#### Commands

| Command | Description |
|---------|-------------|
| `/waypoint:get` | Load project context from waypoint + git + relevant memories |
| `/waypoint:set` | Extract session memories, then store a waypoint snapshot |

#### Skills

| Skill | Triggers On |
|-------|-------------|
| **Waypoint Workflow** | "set a waypoint", "resume work", "where were we", session management |
| **Vector Memory Usage** | "remember this", "search memories", "what did we decide", proactive memory search |

#### Hooks

| Event | Behavior |
|-------|----------|
| **SessionStart** | Suggests loading waypoint if server is available |
| **UserPromptSubmit** | Detects `/clear` and suggests setting waypoint first |
| **Stop** | Monitors context usage — warns at 50%, blocks at 75% |

#### Workflow

```
1. Session starts → Accept waypoint load suggestion
2. Work on tasks
3. Context monitor warns at 50% → Consider setting a waypoint
4. Complete discrete task → /waypoint:set
5. /clear → Fresh context for next task
6. Repeat
```

#### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VECTOR_MEMORY_DB_PATH` | `.vector-memory/memories.db` | Database location |
| `VECTOR_MEMORY_HTTP_PORT` | `3271` | HTTP server port |

### frontend-design

Design skills, browser automation, and UI auditing for frontend development.

```bash
/plugin install frontend-design@cc-plugins
```

#### Skills

| Skill | Triggers On |
|-------|-------------|
| **Frontend Design** | "build a landing page", "create a component", creative/marketing UI tasks |
| **Interface Design** | "build a dashboard", "design an admin panel", SaaS/tool/data interface tasks |
| **Playwright** | "test my website", "take a screenshot", browser automation tasks |
| **Web Design Guidelines** | "review my UI", "check accessibility", "audit design" |

#### Commands

| Command | Description |
|---------|-------------|
| `/init` | Overview of the plugin — all skills, commands, and design system workflow |
| `/design:status` | Show current design system state from `.frontend-design/system.md` |
| `/design:audit` | Check code against design system patterns + web interface guidelines |
| `/design:extract` | Scan existing code and generate a `.frontend-design/system.md` |
| `/design:critique` | Self-critique the UI just built, then rebuild what defaulted |

#### MCP Server (auto-loaded)

The [@playwright/mcp](https://github.com/microsoft/playwright-mcp) server provides 25+ browser control tools (navigate, click, fill, snapshot, etc.) accessible directly as MCP tools.

#### Design System

Uses `.frontend-design/system.md` in your project to persist design decisions (style identity, visual language with exact CSS values, rules/constraints, tokens, component patterns, and decision rationale) across sessions.

## License

MIT
