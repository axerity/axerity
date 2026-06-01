---
title: Navigation
description: Sidebar, groups, dropdowns, tabs, and ordering.
icon: list
---

# Navigation

Your sidebar is built from the folder structure under `src/content/docs`, and
ordered by `meta.json` files. The top navigation and area switching come from
`axerity.json`.

## Folders become sidebar sections

Each top-level folder under `src/content/docs` becomes a section. Files inside a
folder become its pages. Nest a folder inside another and it becomes a
collapsible group.

```
content/docs/
  index.md            ->  /docs
  installation.md     ->  /docs/installation
  components/
    callout.md        ->  /docs/components/callout
  api/
    users/
      get-user.md     ->  /docs/api/users/get-user   (nested group)
```

## meta.json

Every folder can have a `meta.json` that sets its title, icon, and the order of
its pages.

```json title="meta.json"
{
	"title": "Getting Started",
	"icon": "rocket",
	"pages": ["index", "installation", "quick-start"]
}
```

| Field         | What it does                                                  |
| ------------- | ------------------------------------------------------------- |
| `title`       | The section or group label                                    |
| `icon`        | A Lucide icon name shown next to the label                    |
| `pages`       | Order of pages by slug. Anything left out is added at the end |
| `defaultOpen` | For a nested group, expand it by default                      |

Pages not listed in `pages` are appended in alphabetical order, so you only have
to list the ones you care about.

## Page frontmatter

Each page sets its own metadata in frontmatter:

```md
---
title: Installation
description: Get Axerity running locally.
icon: download
badge: New
---
```

| Field         | What it does                                           |
| ------------- | ------------------------------------------------------ |
| `title`       | Sidebar label and page title                           |
| `description` | Used for SEO, search, and prev/next                    |
| `icon`        | Lucide icon next to the sidebar link                   |
| `badge`       | Small pill next to the title, such as `New`            |
| `layout`      | `api` switches to the wide API layout                  |
| `method`      | An HTTP method shown as a colored badge in the sidebar |

## Dropdowns and tabs

A dropdown swaps the entire sidebar. Use it to split a site into areas like
Guides and API Reference. Each dropdown can have its own top-nav tabs.

```json title="axerity.json"
{
	"dropdowns": [
		{
			"label": "Guides",
			"icon": "book-open",
			"href": "/docs",
			"match": "/docs",
			"tabs": [
				{ "title": "Documentation", "href": "/docs", "match": "/docs" },
				{ "title": "Components", "href": "/docs/components/callout", "match": "/docs/components" }
			]
		},
		{
			"label": "API Reference",
			"icon": "code",
			"href": "/docs/api/users/get-user",
			"match": "/docs/api"
		}
	]
}
```

- `href` is where the link goes.
- `match` is the path prefix that marks a dropdown or tab as active. The longest
  match wins, so nested areas take priority.
- The sidebar shows only the sections under the active dropdown, and the navbar
  shows only that dropdown's tabs.

## Sidebar links

Pin external links to the bottom of the sidebar. They stay in place while the
nav scrolls, and open in a new tab.

```json title="axerity.json"
{
	"sidebarLinks": [
		{ "title": "Support", "href": "https://example.com/support" },
		{ "title": "Dashboard", "href": "https://app.example.com" }
	]
}
```

## Versions

Add a version switcher to the navbar.

```json title="axerity.json"
{
	"versions": [
		{ "label": "v2.0", "href": "/docs" },
		{ "label": "v1.0", "href": "https://v1.example.com" }
	]
}
```
