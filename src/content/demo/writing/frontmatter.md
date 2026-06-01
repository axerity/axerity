---
title: Frontmatter
description: Metadata that drives titles, icons, and ordering.
icon: tag
---

# Frontmatter

Every page starts with a YAML frontmatter block. It supplies the page's
metadata to the engine.

## Fields

```yaml
---
title: Frontmatter
description: Metadata that drives titles, icons, and ordering.
icon: tag
badge: New
---
```

| Field         | Purpose                                   |
| ------------- | ----------------------------------------- |
| `title`       | Sidebar label and page `<title>`          |
| `description` | Meta description, used for SEO            |
| `icon`        | Lucide icon shown beside the sidebar link |
| `badge`       | Small pill next to the title (e.g. `New`) |

## How it's used

The content-tree generator reads each page's frontmatter to build the sidebar,
so changing a `title` here updates the navigation automatically.
