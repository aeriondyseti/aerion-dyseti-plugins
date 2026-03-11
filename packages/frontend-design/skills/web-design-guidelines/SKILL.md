---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines — covering accessibility, focus states, forms, animation, typography, performance, navigation, hydration safety, and dark mode.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

## What Gets Checked

- **Accessibility**: aria-labels, semantic HTML, keyboard handlers, alt text, aria-live
- **Focus States**: visible indicators, :focus-visible usage, no removed outlines
- **Forms**: autocomplete, input types, paste not blocked, clickable labels, error handling
- **Animation**: prefers-reduced-motion, transform/opacity only, interruptible, no transition:all
- **Typography**: proper punctuation, curly quotes, tabular-nums for data
- **Performance**: list virtualization, no layout thrashing, preconnect/preload
- **Navigation**: URL reflects state, deep-linking, destructive action confirmation
- **Hydration**: controlled inputs have onChange, date/time server/client guards
- **Dark Mode**: color-scheme set, theme-color meta, native select styling

## Output Format

Report findings grouped by file using `file:line` format (VS Code clickable). State issue concisely. Mark passing files with a checkmark. Omit explanations unless fixes are non-obvious.
