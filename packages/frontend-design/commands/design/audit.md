---
name: design:audit
description: Check code against your design system patterns and web interface guidelines (accessibility, performance, etc).
---

# Design Audit

Check existing code against your design system and web interface guidelines.

## Usage

```
/design:audit <path>     # Audit specific file/directory
/design:audit            # Audit common UI paths
```

This command runs two passes:

## Pass 1: Design System Check

**If `.frontend-design/system.md` exists:**

1. **Spacing violations** — values not on defined grid (e.g. 17px when base is 4px)
2. **Depth violations** — borders-only system using shadows, or vice versa
3. **Color violations** — colors not in defined palette
4. **Pattern drift** — components not matching documented patterns (button height, card padding, etc.)
5. **Typography violations** — font families, sizes, or weights not in the type scale

**If no system.md:**

```
No design system to audit against.

Create one:
1. Build UI → Claude establishes system with you
2. Run /design:extract → create system from existing code
```

## Pass 2: Web Interface Guidelines

Fetch the latest guidelines from:
```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Then check the same files for:
- **Accessibility** — aria-labels, semantic HTML, keyboard handlers, alt text
- **Focus states** — visible indicators, :focus-visible usage
- **Forms** — autocomplete, input types, paste not blocked, clickable labels
- **Animation** — prefers-reduced-motion, transform/opacity only, no transition:all
- **Typography** — proper punctuation, tabular-nums for data
- **Performance** — list virtualization, preconnect/preload
- **Navigation** — URL reflects state, deep-linking support
- **Hydration** — controlled inputs have onChange, date/time guards
- **Dark mode** — color-scheme set, theme-color meta tag

## Report Format

```
Design System Audit: src/components/

Violations:
  Button.tsx:12 - Height 38px (pattern: 36px)
  Card.tsx:8 - Shadow used (system: borders-only)
  Input.tsx:20 - Spacing 14px (grid: 4px, nearest: 12px or 16px)

Web Interface Guidelines:
  Nav.tsx:45 - Icon button missing aria-label
  Form.tsx:23 - Input missing autocomplete attribute
  Table.tsx:67 - Number column missing tabular-nums
  Layout.tsx:12 ✓

Suggestions:
  - Update Button height to match pattern
  - Replace shadow with border
  - Add aria-label to icon buttons
```

## Implementation

1. Check for `.frontend-design/system.md` — parse and audit if present
2. Fetch web interface guidelines via WebFetch
3. Read target files (tsx, jsx, css, scss, html)
4. Run both checks against files
5. Report all violations in `file:line` format with suggestions
