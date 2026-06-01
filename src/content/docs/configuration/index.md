---
title: The config file
description: Everything you set in axerity.json.
icon: sliders
---

# The config file

The whole site is configured from one file at the project root: `axerity.json`.
You never edit code to change the site. Drop in Markdown, set up your
`meta.json` files for ordering, and edit `axerity.json` for everything global.

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

## Fields

| Field          | Type   | What it does                                                                   |
| -------------- | ------ | ------------------------------------------------------------------------------ |
| `name`         | string | Site name, used in the page title and navbar                                   |
| `description`  | string | Site description, used for SEO and `llms.txt`                                  |
| `url`          | string | Canonical site URL; enables absolute links in sitemap, RSS, and OpenGraph      |
| `github`       | string | Repo URL, shown as the GitHub icon in the navbar and footer                    |
| `editLink`     | string | Base URL for the "Edit this page" link; the source path is appended            |
| `theme`        | string | A built-in [theme](/theming/themes) preset                                     |
| `layout`       | string | `flat` (default) or `boxed`. See [Layouts](/configuration/layouts)             |
| `basePath`     | string | Serve the whole site under a sub-path like `/docs`. Empty (default) is the root |
| `sidebar`      | object | Sidebar appearance: `{ "variant": "flush" \| "card" \| "floating" }`           |
| `logo`         | object | Navbar logo `{ light, dark, alt, href }`. Local SVGs are inlined               |
| `og`           | object | Per-page OpenGraph image generation `{ enabled, background, foreground, … }`   |
| `ogImage`      | string | Static OG image path, used when `og.enabled` is off                            |
| `banner`       | object | Announcement bar `{ text, href, id, dismissible }`                             |
| `analytics`    | object | `{ plausible, googleAnalytics }` scripts injected on every page                |
| `topNav`       | array  | Fallback top nav links when no dropdowns are set                               |
| `versions`     | array  | Versions shown in the navbar version switcher                                  |
| `dropdowns`    | array  | Areas that swap the whole sidebar. See [Navigation](/configuration/navigation) |
| `sidebarLinks` | array  | Links pinned to the bottom of the sidebar                                      |
| `social`       | array  | Social links shown in the footer `{ icon, href, label }`                       |
| `footer`       | object | Footer `{ note, links }`                                                       |

Every field except `name` and `topNav` is optional. Leave a field out and the
related UI does not render.

## Icons

Anywhere a config field takes an `icon`, use a [Lucide](https://lucide.dev) icon
name in kebab case, such as `book-open`, `credit-card`, or `git-branch`. Any
Lucide icon works, so you never register icons by hand.
