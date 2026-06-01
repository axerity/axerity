---
title: AI and LLMs
description: Copy page, Markdown URLs, and llms.txt.
icon: file-text
---

# AI and LLMs

Axerity makes your docs easy to feed to a language model.

## Copy page

Every page has a copy page button at the top right. The main button copies the
page as clean Markdown, with the frontmatter and scripts stripped out. The
dropdown has more options:

- Copy page as Markdown.
- View as Markdown, which opens the raw Markdown in a new tab.
- Open in ChatGPT, with a prompt pointing at the page.
- Open in Claude, with the same.

## Markdown URLs

Every page is also served as raw Markdown at a `.md` URL. Add `.md` to any page
path:

```
/installation      ->  the rendered page
/installation.md   ->  the raw Markdown
```

These are static files, generated at build time.

## llms.txt

Two files are generated for whole site ingestion, following the
[llms.txt](https://llmstxt.org) convention:

- `/llms.txt` is an index of every page with links to its Markdown.
- `/llms-full.txt` is the full Markdown of every page in one file.
