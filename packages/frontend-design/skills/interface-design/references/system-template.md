# Design System Template

Use this template when saving to `.frontend-design/system.md`. Fill in only the sections that apply — skip what hasn't been decided yet.

---

# Design System

## Style

One paragraph that captures the aesthetic identity. Name the style, describe its character, and state what makes it distinct. This is the gut-check — someone reading only this paragraph should be able to picture the interface.

> Example: "Cinematic Editorial — dark matte charcoal (#181818) with warm beige text (#EBDCC4) and coral-rust accents. Bold uppercase 'Clash Grotesk' headlines at viewport-relative scale, 'General Sans' body copy. Fractal noise texture overlay. No pill shapes, no gradients — strictly 4px corners and 1px solid borders."

> Example: "Midnight Glassmorphism — dark theme (#0F1419) with 3% opacity glass panels and bright cyan (#00D9FF) accents. Geometric 'Satoshi' type family. Radial gradient depth blobs at 0.1 opacity. Clean, technical, minimal."

## Visual Language

Exact CSS values. This is the copy-paste source for implementation.

### Color Palette
```
Primary background:   #______ ([name])
Surface elevated:     #______ ([name])
Accent:               #______ ([name])
Text primary:         #______ ([name])
Text secondary:       #______ ([name])
Text muted:           #______ ([name])
Borders:              #______ ([name])
Borders subtle:       #______ ([name])
```

### Typography
```
Display font:         '[name]', [fallback]
Display style:        [weight], [tracking], [leading], [transform]
Display size:         [desktop] / [mobile]

Body font:            '[name]', [fallback]
Body style:           [weight range], [leading]
Body color:           #______

Mono font:            '[name]', [fallback]
```

### Effects
```
Surface treatment:    [e.g. rgba(255, 255, 255, 0.03) + backdrop-filter: blur(12px)]
Texture:              [e.g. fractal noise SVG at 0.03 opacity]
Shadows:              [e.g. 0 1px 3px rgba(0, 0, 0, 0.08)]
Glows:                [e.g. 0 0 40px rgba(0, 217, 255, 0.15)]
Depth effects:        [e.g. radial gradient blob, 600px, at 0.1 opacity]
Transitions:          [e.g. 200ms ease-in-out, active:scale-95]
```

## Rules

Explicit constraints and prohibitions. What NOT to do is as important as what to do.

- [e.g. No pill shapes — max 4px border radius]
- [e.g. No gradients on surfaces]
- [e.g. Borders-only depth — no box shadows]
- [e.g. Single accent color only — no secondary accents]
- [e.g. All headings uppercase]

## Tokens

### Spacing
Base: [4px | 8px]
Scale: [comma-separated multiples]

### Radius
Scale: [values — note constraints from Rules if any]

### Type Scale
Sizes: [comma-separated, mark base]
Weights: [comma-separated]

## Patterns

### Button Primary
- Height: ___px
- Padding: ___px ___px
- Radius: ___px
- Font: ___px, weight ___
- Background: [token reference]

### Card Default
- Border: [spec]
- Padding: ___px
- Radius: ___px
- Background: [token reference]
- Shadow: [spec or "none"]

### Input Default
- Height: ___px
- Padding: ___px ___px
- Radius: ___px
- Border: [spec]
- Background: [token reference]

[Add more patterns as they emerge]

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| [what was chosen] | [why] | YYYY-MM-DD |
