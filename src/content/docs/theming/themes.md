---
title: Themes
description: Eight built-in presets inspired by well-known docs.
icon: palette
---

# Themes

A theme is a complete palette: backgrounds, text, borders, and an accent, with a
matching dark mode. Pick one in `axerity.json`:

```json
{
	"theme": "stripe"
}
```

Leave it out (or use `"neutral"`) for the default grayscale look. The theme is
applied on the server, so there is no flash on load, and dark mode works with
every preset.

## Presets

Each preset is tuned after a product's documentation. Set the `theme` value to
the name on the left.

| Theme       | Accent                                                                                                                                               | Feel                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `neutral`   | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.4 0 0);vertical-align:middle"></span> Grayscale     | Quiet monochrome, the default         |
| `stripe`    | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.55 0.23 274);vertical-align:middle"></span> Indigo  | Airy and light with soft corners      |
| `vercel`    | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.18 0 0);vertical-align:middle"></span> Black/white  | Maximum contrast, sharp corners       |
| `linear`    | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.55 0.16 277);vertical-align:middle"></span> Violet  | Cool grays, dense, great in dark      |
| `supabase`  | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.76 0.16 162);vertical-align:middle"></span> Green   | Dark-first with a bright green accent |
| `github`    | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.52 0.18 256);vertical-align:middle"></span> Blue    | Primer blue and the system font       |
| `tailwind`  | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.68 0.15 233);vertical-align:middle"></span> Sky     | Slate grays and rounded corners       |
| `mintlify`  | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.62 0.16 150);vertical-align:middle"></span> Emerald | Friendly, light, and rounded          |
| `anthropic` | <span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:oklch(0.62 0.13 42);vertical-align:middle"></span> Clay     | Warm accent on an ivory page          |

## Layout

The `theme` controls color, type, and corners. The `layout` controls the shape
of the page and is set separately:

```json
{
	"theme": "stripe",
	"layout": "boxed"
}
```

- `flat` puts the sidebar flush against the left edge and fills the screen.
- `boxed` centers the whole site in a max-width container on wide screens.

Mix and match. Stripe and Tailwind feel at home boxed; Vercel and Linear suit
the flat, full-width look.

## Sidebar

Choose how the sidebar is presented with `sidebar.variant`:

```json
{
	"sidebar": { "variant": "floating" }
}
```

- `flush` is the default: a tinted panel against the edge with a divider.
- `card` insets the sidebar as a bordered, rounded panel.
- `floating` detaches it into a rounded, shadowed card that floats in the
  margin.

All three pick up the theme's accent tint, so a floating Supabase sidebar reads
green while a floating Stripe one reads indigo.
