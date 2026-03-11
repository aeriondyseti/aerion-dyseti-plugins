---
name: design:extract
description: Extract design patterns from existing code to create a system.md file.
---

# Design Extract

Extract design patterns from existing code to create a system.

## Usage

```
/design:extract          # Extract from common UI paths
/design:extract <path>   # Extract from specific directory
```

## What to Extract

**Scan UI files (tsx, jsx, vue, svelte, html, css, scss) for:**

1. **Repeated spacing values**
   ```
   Found: 4px (12x), 8px (23x), 12px (18x), 16px (31x), 24px (8x)
   → Suggests: Base 4px, Scale: 4, 8, 12, 16, 24
   ```

2. **Repeated radius values**
   ```
   Found: 6px (28x), 8px (5x)
   → Suggests: Radius scale: 6px, 8px
   ```

3. **Button patterns**
   ```
   Found 8 buttons:
   - Height: 36px (7/8), 40px (1/8)
   - Padding: 12px 16px (6/8), 16px (2/8)
   → Suggests: Button pattern: 36px h, 12px 16px padding
   ```

4. **Card patterns**
   ```
   Found 12 cards:
   - Border: 1px solid (10/12), none (2/12)
   - Padding: 16px (9/12), 20px (3/12)
   → Suggests: Card pattern: 1px border, 16px padding
   ```

5. **Depth strategy**
   ```
   box-shadow found: 2x
   border found: 34x
   → Suggests: Borders-only depth
   ```

6. **Typography patterns**
   ```
   Font families used: 'Space Grotesk' (heading), 'IBM Plex Sans' (body)
   Font sizes: 14px (23x), 16px (18x), 24px (5x), 32px (2x)
   → Suggests: Type scale: 14, 16, 24, 32
   ```

7. **Color palette**
   ```
   CSS variables: --brand: #6366f1 (12x), --surface: #0a0a0b (8x)
   → Suggests: Brand purple, dark surface
   ```

8. **Visual language / effects**
   ```
   backdrop-filter: blur(12px) found 4x
   rgba(255, 255, 255, 0.03) found 6x → glassmorphism surface treatment
   transition: 200ms ease-in-out found 8x
   box-shadow: 0 0 40px rgba(...) found 2x → glow effect
   ```

**Then present the full extracted system with exact CSS values:**
```
Extracted Design System:

Direction: Dark, technical, glassmorphism depth

Visual Language:
  Background:       #0a0a0b
  Surface:          rgba(255, 255, 255, 0.03) + backdrop-filter: blur(12px)
  Accent:           #6366f1
  Text primary:     #f1f5f9
  Text muted:       #64748b
  Border:           rgba(255, 255, 255, 0.05)
  Shadow/Glow:      0 0 40px rgba(99, 102, 241, 0.15)
  Transitions:      200ms ease-in-out

Tokens:
  Spacing base: 4px, scale: 4, 8, 12, 16, 24, 32
  Radius: 6px, 8px
  Type: Space Grotesk (heading) / IBM Plex Sans (body), scale: 14, 16, 24, 32

Patterns:
  Button: 36px h, 12px 16px pad, 6px radius
  Card: 1px border, 16px pad, glassmorphism surface

Create .frontend-design/system.md with these? (y/n/customize)
```

## Output Format

Use the template from `references/system-template.md` to structure the system.md file. The Visual Language section should contain exact CSS values that can be copy-pasted into code.

## Implementation

1. Glob for UI files (tsx, jsx, vue, svelte, html, css, scss)
2. Parse for repeated values — colors, spacing, fonts, effects, transitions
3. Identify component patterns — buttons, cards, inputs
4. Infer direction and depth strategy from the data
5. Present findings with exact CSS values
6. Offer to create `.frontend-design/system.md`
7. Let user customize before saving
