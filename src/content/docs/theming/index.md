---
title: Theming overview
description: How Axerity's design-token system works.
icon: palette
---

<script>
	import { Callout } from '$lib';
</script>

# Theming

Axerity is themed entirely through **CSS custom properties** (design tokens). Every
color, font, radius, and layout rail is a token, components never reference raw
values, so changing a handful of variables re-themes the whole site, light and
dark, in one place.

Everything lives in **`src/routes/layout.css`**.

## The two layers

Theming is split into two layers:

1. **Semantic tokens**, `--bg`, `--fg`, `--accent`, `--border`… defined on
   `:root` (light) and overridden on `.dark` (dark). This is what you edit.
2. **Tailwind bridge**, an `@theme inline` block maps those tokens onto Tailwind
   utilities (`bg-bg`, `text-fg`, `border-border`, `rounded-lg`, …) so components
   can use them as normal classes.

```css title="src/routes/layout.css"
:root {
	--bg: oklch(1 0 0);
	--fg: oklch(0.205 0 0);
	--accent: oklch(0.205 0 0);
	/* …all light values… */
}

.dark {
	--bg: oklch(0.145 0 0);
	--fg: oklch(0.985 0 0);
	--accent: oklch(0.922 0 0);
	/* …dark overrides… */
}

@theme inline {
	--color-bg: var(--bg);
	--color-fg: var(--fg);
	--color-accent: var(--accent);
	/* …exposes bg-bg / text-fg / text-accent / … to Tailwind… */
}
```

## The semantic tokens

| Token               | Used for                                 |
| ------------------- | ---------------------------------------- |
| `--bg`              | Page background                          |
| `--bg-subtle`       | Muted background (headers, hover)        |
| `--surface`         | Card / panel background                  |
| `--surface-raised`  | Elevated surfaces (code blocks)          |
| `--fg`              | Primary text                             |
| `--fg-muted`        | Body / secondary text                    |
| `--fg-subtle`       | Tertiary text, labels                    |
| `--border`          | Default borders                          |
| `--border-strong`   | Emphasized borders                       |
| `--accent`          | Accent, links, active states, highlights |
| `--accent-hover`    | Accent hover state                       |
| `--accent-contrast` | Text on a solid accent background        |
| `--brand-gradient`  | The signature gradient                   |

<Callout type="tip">

Because components only use these tokens, you almost never edit a component to
re-theme, you edit the tokens.

</Callout>

## The default theme

Out of the box Axerity ships a **neutral (shadcn-style)** theme: pure grayscale
surfaces, a monochrome accent, and **dark by default**. The next pages show how
to make it yours.

- [Colors](/docs/theming/colors), accent and surfaces
- [Typography](/docs/theming/typography), fonts
- [Layout](/docs/theming/layout), widths and rails
- [Code blocks](/docs/theming/code), syntax themes
- [Advanced](/docs/theming/advanced), radius, custom tokens, full themes
