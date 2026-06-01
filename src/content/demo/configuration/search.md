---
title: Search
description: Full text search across your docs.
icon: search
---

# Search

Axerity ships with full text search powered by [Orama](https://orama.com). Press
`Cmd K` or `Ctrl K`, or click the search box in the navbar, to open it.

## How it works

The search index is built at compile time. Every page's title, description, and
text is collected into a single JSON file. When you open search the first time,
that file is fetched and loaded into Orama in the browser. Searching then runs
locally, with no server.

## What is indexed

- Page titles, with the highest weight.
- Page descriptions from frontmatter.
- The page body text, with Markdown and code stripped out.
- The section name, shown next to each result.

There is nothing to configure. Add pages and they are searchable on the next
build.

## Keyboard

| Key            | Action            |
| -------------- | ----------------- |
| `Cmd/Ctrl + K` | Open or close     |
| `Up` / `Down`  | Move between hits |
| `Enter`        | Open the result   |
| `Esc`          | Close             |
