---
name: design:status
description: Show current design system state including direction, tokens, and patterns.
---

# Design System Status

Show current design system state.

## What to Show

**If `.frontend-design/system.md` exists:**

Display:
```
Design System: [Project Name]

Direction: [Precision & Density / Warmth / Bold & Creative / etc]
Foundation: [Cool slate / Warm stone / etc]
Depth: [Borders-only / Subtle shadows / Layered]

Tokens:
- Spacing base: 4px
- Radius scale: 4px, 6px, 8px
- Colors: [count] defined

Patterns:
- Button Primary (36px h, 16px px, 6px radius)
- Card Default (border, 16px pad)
- [other patterns...]

Last updated: [from git or file mtime]
```

**If no system.md:**

```
No design system found.

Options:
1. Build UI → system will be established automatically
2. Run /design:extract → pull patterns from existing code
```

## Implementation

1. Read `.frontend-design/system.md`
2. Parse direction, tokens, patterns
3. Format and display
4. If no system, suggest next steps
