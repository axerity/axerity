---
title: The config file
description: Everything you set in axerity.json, field by field.
icon: sliders
---

# The config file

The whole site is configured from one file at the project root: `axerity.json`.
You never edit code to change the site. Drop in Markdown, set up your
`meta.json` files for ordering, and edit `axerity.json` for everything global.

The file can also be named `docs.json`. The engine reads whichever it finds,
preferring `axerity.json`, so a project moving over from another tool can keep
its existing filename.

Only `name` and `topNav` are required. Every other field is optional, and
leaving one out simply means the related UI does not render.

## Editor autocomplete

The repo ships a JSON schema. Point your config at it on the first line and your
editor gives you autocomplete and validation for every field:

```json title="axerity.json"
{
	"$schema": "./axerity.schema.json"
}
```

## A full example

```json title="axerity.json"
{
	"$schema": "./axerity.schema.json",
	"name": "Axerity",
	"description": "A documentation site generator built with Svelte.",
	"url": "https://axerity.com",
	"github": "https://github.com/your/repo",
	"editLink": "https://github.com/your/repo/edit/main/src/content/docs",
	"theme": "stripe",
	"layout": "boxed",
	"sidebar": { "variant": "floating" },
	"logo": { "light": "/logo-light.svg", "dark": "/logo-dark.svg" },
	"favicon": "/favicon.png",
	"og": { "enabled": true },
	"banner": { "text": "v1.0 is out", "href": "/docs", "id": "v1", "dismissible": true },
	"versions": [{ "label": "v1.0", "href": "/docs" }],
	"dropdowns": [
		{
			"label": "Guides",
			"icon": "book-open",
			"href": "/docs",
			"match": "/docs",
			"tabs": [{ "title": "Documentation", "href": "/docs", "match": "/docs" }]
		}
	],
	"sidebarLinks": [{ "title": "Support", "href": "https://example.com/support" }],
	"social": [{ "icon": "rss", "href": "/rss.xml" }],
	"footer": { "note": "Built with Axerity", "links": [{ "title": "Status", "href": "/status" }] },
	"analytics": { "plausible": "axerity.com" },
	"topNav": [{ "title": "Docs", "href": "/docs" }]
}
```

## Fields at a glance

| Field          | Type                     | What it does                                                              |
| -------------- | ------------------------ | ------------------------------------------------------------------------ |
| `name`         | string                   | Site name, used in the page title and navbar. **Required**               |
| `topNav`       | array                    | Top navbar links, used when no dropdowns are set. **Required**           |
| `tagline`      | string                   | Short phrase shown beside the name in some layouts                       |
| `description`  | string                   | Site description for SEO and `llms.txt`                                  |
| `url`          | string                   | Canonical site URL; powers absolute links in sitemap, RSS, and OG        |
| `theme`        | string                   | A built-in [theme](/theming/themes) preset                               |
| `brand`        | object                   | Accent and corner overrides on top of the theme                          |
| `logo`         | object                   | Navbar logo with light and dark variants                                 |
| `favicon`      | string                   | Favicon path, like `/favicon.png`                                        |
| `layout`       | string                   | `flat` (default) or `boxed`                                              |
| `sidebar`      | object                   | Sidebar look and default open state                                      |
| `sidebarLinks` | array                    | Links pinned to the bottom of the sidebar                                |
| `dropdowns`    | array                    | Navbar areas that swap the whole sidebar                                 |
| `versions`     | array                    | Entries for the navbar version switcher                                  |
| `og`           | object                   | Per-page OpenGraph image generation                                      |
| `ogImage`      | string                   | Static OG image, used when `og.enabled` is off                           |
| `banner`       | object                   | Announcement bar across the top                                          |
| `footer`       | object                   | Footer note and links                                                    |
| `social`       | array                    | Social links shown in the footer                                         |
| `analytics`    | object                   | Plausible or Google Analytics scripts                                    |
| `github`       | string                   | Repo URL, shown as the GitHub icon                                       |
| `editLink`     | string                   | Base URL for the "Edit this page" link                                   |
| `openapi`      | string, object, or array | Generate an API reference from an OpenAPI spec                            |
| `basePath`     | string                   | Serve the whole site under a sub-path like `/docs`                       |

## Identity and SEO

### name

**Required.** The site name. It appears in the navbar (when no logo is set) and
is used to build the browser tab title on every page, as `Page Title - Name`.

```json
{ "name": "Axerity" }
```

### tagline

A short phrase that sits next to the name in layouts that show one. Keep it to a
few words.

```json
{ "tagline": "Docs that build themselves" }
```

### description

A one-line summary of the site. It fills the meta description for search
engines, the default OpenGraph description, and the header of the generated
`llms.txt`.

```json
{ "description": "A documentation site generator built with Svelte." }
```

### url

The canonical, absolute URL the site is served from, with no trailing slash.
This is what turns relative paths into absolute ones in the sitemap, the RSS
feed, and OpenGraph tags. Set it before you ship, otherwise those outputs fall
back to relative links.

```json
{ "url": "https://axerity.com" }
```

## Branding

### theme

The name of a built-in palette preset. Each is a cohesive set of colors, and
where it matters a font and corner radius, drawn from a well-known product's
docs. Available presets:

`neutral`, `stripe`, `vercel`, `linear`, `supabase`, `github`, `tailwind`,
`mintlify`, `anthropic`.

See [Themes](/theming/themes) for what each looks like.

```json
{ "theme": "stripe" }
```

### brand

Overrides layered on top of the chosen `theme`. Set your own accent color and
corner radius without leaving the preset for everything else. Colors take any
CSS color value; `radius` takes a length such as `0.5rem`.

| Sub-field         | Type   | What it does                                            |
| ----------------- | ------ | ------------------------------------------------------- |
| `accent`          | string | Primary accent color in light mode                      |
| `accentDark`      | string | Accent color in dark mode, if it should differ          |
| `accentContrast`  | string | Text color placed on top of the accent                  |
| `radius`          | string | Corner radius for buttons, cards, and inputs            |

```json
{
	"brand": {
		"accent": "#0a8237",
		"accentDark": "#07c983",
		"radius": "0.5rem"
	}
}
```

See [Colors](/theming/colors) for the full set of variables.

### logo

The navbar logo. Provide separate `light` and `dark` files so the right one
shows in each color scheme. Local SVGs are inlined so they pick up the current
text color. Without a logo, the `name` renders as text instead.

| Sub-field | Type   | What it does                                              |
| --------- | ------ | -------------------------------------------------------- |
| `light`   | string | Logo shown in light mode                                  |
| `dark`    | string | Logo shown in dark mode                                   |
| `alt`     | string | Alt text for the image                                    |
| `href`    | string | Where the logo links to. Defaults to the site root        |

```json
{
	"logo": {
		"light": "/logo-light.svg",
		"dark": "/logo-dark.svg",
		"alt": "Axerity",
		"href": "/"
	}
}
```

### favicon

Path to the browser tab icon, such as `/favicon.png`. Any image format the
browser supports works. Leave it out to use the bundled default icon.

```json
{ "favicon": "/favicon.png" }
```

## Layout and the sidebar

### layout

The page width. `flat` (the default) is full width with the sidebar flush to the
left edge. `boxed` centers the content in a max-width container on wide screens.

```json
{ "layout": "boxed" }
```

See [Layouts](/configuration/layouts) for the difference in detail.

### sidebar

How the sidebar looks and whether its groups start expanded.

| Sub-field     | Type    | What it does                                                            |
| ------------- | ------- | ---------------------------------------------------------------------- |
| `variant`     | string  | `flush` (default), `card`, or `floating`                                |
| `defaultOpen` | boolean | Expand every collapsible group by default                               |

The variants: `flush` is a tinted panel against the edge with a divider; `card`
is a bordered, rounded panel inset from the edges; `floating` is a detached,
rounded, shadowed card. A folder's own `defaultOpen` in its `meta.json` wins
over the global setting.

```json
{ "sidebar": { "variant": "floating", "defaultOpen": false } }
```

### sidebarLinks

Plain links pinned to the bottom of the sidebar, below the page tree. Good for a
support or changelog link. Each entry is a `title` and an `href`.

```json
{
	"sidebarLinks": [
		{ "title": "Support", "href": "https://example.com/support" },
		{ "title": "Changelog", "href": "/changelog" }
	]
}
```

## Top navigation

### topNav

**Required.** The links across the top navbar. This is the simple navbar: a flat
row of links. When you set `dropdowns`, those take over the navbar and `topNav`
is the fallback. Each link:

| Sub-field  | Type    | What it does                                                  |
| ---------- | ------- | ------------------------------------------------------------ |
| `title`    | string  | The link text                                                |
| `href`     | string  | Where it goes                                                |
| `icon`     | string  | Optional [Lucide](https://lucide.dev) icon name              |
| `match`    | string  | Path prefix that marks the link active, if it differs from `href` |
| `external` | boolean | Force the link to open in a new tab                          |

```json
{
	"topNav": [
		{ "title": "Docs", "href": "/docs" },
		{ "title": "Blog", "href": "/blog" }
	]
}
```

### dropdowns

Top-level areas that each swap the entire sidebar when you enter them, with an
optional row of tabs underneath the navbar. Use these when the site has distinct
sections such as Guides, API, and SDK that should not share one sidebar.

| Sub-field | Type   | What it does                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| `label`   | string | The dropdown label in the navbar                             |
| `icon`    | string | Optional icon next to the label                              |
| `href`    | string | Landing path for the area                                    |
| `match`   | string | Path prefix that marks this area active                      |
| `tabs`    | array  | Optional sub-tabs, each a `topNav`-style link                |

```json
{
	"dropdowns": [
		{
			"label": "Guides",
			"icon": "book-open",
			"href": "/docs",
			"match": "/docs",
			"tabs": [{ "title": "Documentation", "href": "/docs", "match": "/docs" }]
		}
	]
}
```

See [Navigation](/configuration/navigation) for how areas and tabs resolve.

### versions

Entries for the version switcher in the navbar. Each is a `label` and the `href`
its docs live under. The switcher only shows when there is more than one.

```json
{
	"versions": [
		{ "label": "v2.0", "href": "/docs" },
		{ "label": "v1.0", "href": "/v1" }
	]
}
```

## Social cards

### og

Per-page OpenGraph image generation. When enabled, every page gets its own
social card rendered at build time, using the page title and the colors below.
The colors default to your theme, so most sites only need `enabled`.

| Sub-field    | Type    | What it does                                              |
| ------------ | ------- | -------------------------------------------------------- |
| `enabled`    | boolean | Turn per-page image generation on                        |
| `background` | string  | Card background color                                    |
| `foreground` | string  | Title text color                                         |
| `muted`      | string  | Secondary text color                                     |
| `accent`     | string  | Accent used for detail in the card                       |
| `logo`       | string  | Logo in the card. Defaults to the dark site logo         |

```json
{
	"og": {
		"enabled": true,
		"background": "#0b7031",
		"foreground": "#ffffff"
	}
}
```

### ogImage

A single static image used as the social card for every page. This is the
simpler alternative to `og`: set it when you want one fixed card instead of
generated per-page images. It is used whenever `og.enabled` is off.

```json
{ "ogImage": "/og.png" }
```

## Page chrome

### banner

A dismissible announcement bar across the top of every page. Use it for a
release or a notice.

| Sub-field     | Type    | What it does                                                       |
| ------------- | ------- | ----------------------------------------------------------------- |
| `text`        | string  | The message. **Required** when `banner` is set                    |
| `href`        | string  | Makes the banner a link                                           |
| `id`          | string  | A stable id; bump it to re-show a banner readers dismissed        |
| `dismissible` | boolean | Let readers close the banner                                      |

```json
{
	"banner": {
		"text": "v1.0 is out",
		"href": "/docs",
		"id": "v1",
		"dismissible": true
	}
}
```

### footer

The site footer. A short note and a list of links.

| Sub-field | Type   | What it does                                          |
| --------- | ------ | ---------------------------------------------------- |
| `note`    | string | A line of text, such as a copyright                  |
| `links`   | array  | Footer links, each a `title` and an `href`           |

```json
{
	"footer": {
		"note": "Built with Axerity",
		"links": [{ "title": "Status", "href": "/status" }]
	}
}
```

### social

Social and feed links shown in the footer. Each entry takes an `icon`
([Lucide](https://lucide.dev) name), an `href`, and an optional `label` for
screen readers.

```json
{
	"social": [
		{ "icon": "github", "href": "https://github.com/your/repo" },
		{ "icon": "rss", "href": "/rss.xml", "label": "RSS feed" }
	]
}
```

### analytics

Drop-in analytics scripts injected on every page. Set the field for the provider
you use.

| Sub-field         | Type   | What it does                                          |
| ----------------- | ------ | ---------------------------------------------------- |
| `plausible`       | string | Your Plausible domain, such as `axerity.com`         |
| `googleAnalytics` | string | A Google Analytics measurement id, such as `G-XXXX`  |

```json
{ "analytics": { "plausible": "axerity.com" } }
```

## Links

### github

The repository URL. It renders as a GitHub icon in the navbar and footer.

```json
{ "github": "https://github.com/your/repo" }
```

### editLink

The base URL for the "Edit this page" link at the bottom of each page. The
page's source path is appended to it, so point it at your repo's edit route for
the content folder.

```json
{ "editLink": "https://github.com/your/repo/edit/main/src/content/docs" }
```

## API reference

### openapi

Generate a full API reference from one or more OpenAPI 3 specs. The value can be
a single spec path, one config object, or an array of them.

| Sub-field | Type   | What it does                                                         |
| --------- | ------ | ------------------------------------------------------------------- |
| `spec`    | string | Local path or http(s) URL to the spec (JSON or YAML). **Required**  |
| `output`  | string | Content folder for this reference. Default `api-reference`           |
| `title`   | string | Section title. Defaults to the spec's `info.title`                   |

```json
{
	"openapi": [
		{ "spec": "./openapi.json", "output": "api", "title": "API" }
	]
}
```

A bare string is shorthand for `{ "spec": "..." }`:

```json
{ "openapi": "./openapi.json" }
```

See [API reference](/configuration/openapi) for the full workflow.

## Routing

### basePath

Serve the whole site under a sub-path instead of the domain root. Set it to
something like `/docs` when the docs live alongside a marketing site. Leave it
empty (the default) to serve from the root. Internal links and assets are
rewritten to sit under the prefix.

```json
{ "basePath": "/docs" }
```

## Icons

Anywhere a config field takes an `icon`, use a [Lucide](https://lucide.dev) icon
name in kebab case, such as `book-open`, `credit-card`, or `git-branch`. Any
Lucide icon works, so you never register icons by hand.
