---
name: init
description: Overview of the frontend-design plugin — skills, commands, MCP tools, and design system workflow.
---

# Frontend Design Plugin

This plugin provides design skills, browser automation, and UI auditing for frontend development.

## Skills

### frontend-design
Creative, marketing-oriented design for landing pages, campaigns, and distinctive visual experiences. Triggers on requests to build web components, pages, or applications where visual impact and uniqueness matter.

### interface-design
Craft-focused design for dashboards, admin panels, SaaS apps, tools, and data interfaces. Emphasizes intentional design decisions, surface layering, token architecture, and fighting AI defaults. Includes deep dives in `references/` on principles, critique, validation, and examples.

### playwright
Browser automation with Playwright. Auto-detects dev servers, writes test scripts to `/tmp`, executes via a universal runner. Use for testing pages, taking screenshots, validating UX, checking responsive design, or any browser task.

### web-design-guidelines
Audits UI code against Vercel's Web Interface Guidelines — accessibility, focus states, forms, animation, typography, performance, navigation, hydration safety, and dark mode. Fetches latest rules at runtime.

## Commands

| Command | Description |
|---------|-------------|
| `/design:status` | Show current design system state from `.frontend-design/system.md` |
| `/design:audit` | Check code against design system patterns + web interface guidelines |
| `/design:extract` | Scan existing code and generate a `.frontend-design/system.md` |
| `/design:critique` | Self-critique the UI you just built, then rebuild what defaulted |

## MCP Server

The **@playwright/mcp** server is auto-loaded, providing 25+ browser control tools — navigate, click, fill forms, take snapshots, and more — accessible directly as MCP tools without writing scripts.

## Design System

The plugin uses `.frontend-design/system.md` in your project root to persist design decisions across sessions:

- **Direction** — personality, color temperature, depth strategy
- **Visual Language** — exact CSS values for colors, surfaces, effects, and transitions (copy-paste ready)
- **Tokens** — spacing scale, radius, type scale
- **Patterns** — component specs (button height, card padding, input styles, etc.)
- **Decisions** — rationale log explaining *why* each choice was made

**Workflow:**
1. Build UI → Claude establishes design direction with you
2. After building → Claude offers to save patterns to `.frontend-design/system.md`
3. Next session → Claude reads `system.md` and applies the established system
4. Use `/design:extract` to create a system from existing code
5. Use `/design:audit` to check code stays consistent with the system
