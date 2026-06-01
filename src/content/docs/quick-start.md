---
title: Quick Start
description: Write your first page in two minutes.
icon: rocket
badge: New
---

# Quick Start

Adding a page is just creating a Markdown file. Let's add one.

## Create a page

Make a new file at `src/content/docs/hello.md`:

```md
---
title: Hello
icon: book-open
---

# Hello

My first Axerity page.
```

It's immediately available at `/hello` and shows up in the sidebar.

## Order it with meta.json

Each folder has a `meta.json` that controls titles, icons, and ordering:

```json
{
	"title": "Getting Started",
	"icon": "rocket",
	"pages": ["index", "installation", "quick-start", "hello"]
}
```

Pages listed in `pages` appear in that order; anything you leave out is appended
alphabetically.

## Organize with folders

Create a subfolder with its own `meta.json` and it becomes a new sidebar
section. Subfolders are ordered by naming them in the parent's `pages` list.
