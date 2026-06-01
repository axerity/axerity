---
title: Diagrams
description: Draw flowcharts and diagrams with Mermaid.
icon: workflow
---

# Diagrams

Write a fenced code block with the `mermaid` language and it renders as a
diagram. Diagrams are drawn in the browser and follow your light or dark theme.

## Flowchart

````md
```mermaid
flowchart LR
	A[Write Markdown] --> B{Has a fence?}
	B -- mermaid --> C[Render a diagram]
	B -- code --> D[Highlight with Shiki]
```
````

Renders as:

```mermaid
flowchart LR
	A[Write Markdown] --> B{Has a fence?}
	B -- mermaid --> C[Render a diagram]
	B -- code --> D[Highlight with Shiki]
```

## Sequence

```mermaid
sequenceDiagram
	participant R as Reader
	participant S as Server
	R->>S: Request a page
	S-->>R: Pre-rendered HTML
	R->>R: Hydrate and draw diagrams
```

Anything Mermaid supports works, including class diagrams, state diagrams, and
Gantt charts. See the [Mermaid docs](https://mermaid.js.org) for the full syntax.
