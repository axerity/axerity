---
title: The config file
description: Everything you set in axerity.json.
icon: sliders
---

# The config file

The whole site is configured from one file at the project root: `axerity.json`.
You never edit code to change the site. Drop in Markdown, set up your
`meta.json` files for ordering, and edit `axerity.json` for everything global.

## A full example

```json title="axerity.json"
{
	"name": "Axerity",
	"description": "A documentation site generator for Svelte.",
	"github": "https://github.com/your/repo",
	"layout": "flat",
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
	"topNav": [{ "title": "Docs", "href": "/docs" }]
}
```

## Fields

| Field          | Type   | What it does                                                                        |
| -------------- | ------ | ----------------------------------------------------------------------------------- |
| `name`         | string | Site name, used in the page title                                                   |
| `description`  | string | Site description, used for SEO and `llms.txt`                                       |
| `github`       | string | Repo URL, shown as the GitHub icon in the navbar                                    |
| `layout`       | string | `flat` (default) or `boxed`. See [Layouts](/docs/configuration/layouts)             |
| `topNav`       | array  | Fallback top nav links when no dropdowns are set                                    |
| `versions`     | array  | Versions shown in the navbar version switcher                                       |
| `dropdowns`    | array  | Areas that swap the whole sidebar. See [Navigation](/docs/configuration/navigation) |
| `sidebarLinks` | array  | Links pinned to the bottom of the sidebar                                           |

Every field except `name` and `topNav` is optional. Leave a field out and the
related UI does not render.

## Icons

Anywhere a config field takes an `icon`, use a [Lucide](https://lucide.dev) icon
name in kebab case, such as `book-open`, `credit-card`, or `git-branch`. Any
Lucide icon works, so you never register icons by hand.
