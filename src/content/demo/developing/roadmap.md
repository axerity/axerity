---
title: Roadmap
description: What is shipped, planned, and being explored.
icon: map
---

# Roadmap

Where Axerity is and where it is heading. This tracks the engine itself. It is a direction, not a set of promises.

<Roadmap>
	<RoadmapItem title="Prebuilt server engine" status="shipped" eta="0.2.0">

The engine ships compiled. Content and config are read from the filesystem at runtime, with no bundler in the serving path, so a package manager quirk can no longer break a build.

    </RoadmapItem>
    <RoadmapItem title="Runtime base path" status="planned">

Resolve the base path at request time instead of at compile time, so a site can be hosted under a sub path, like a project page.

    </RoadmapItem>
    <RoadmapItem title="OpenAPI for user projects" status="shipped" eta="0.2.2">

API reference generation runs as a CLI pre step, so a project's `openapi` config produces pages without needing the engine compile.

    </RoadmapItem>
    <RoadmapItem title="Static assets from your project" status="shipped" eta="0.2.1">

Images, logos, and other static files are served straight from your project and copied into the build, so a logo or screenshot loads in dev and in production without any extra setup.

    </RoadmapItem>
    <RoadmapItem title="Smaller installs" status="shipped" eta="0.2.5">

Build only packages live in dev dependencies, and client only libraries like the diagram renderer and the search engine are bundled into the prebuilt output instead of installed. A project pulls the runtime packages it needs, not the full toolchain.

    </RoadmapItem>
    <RoadmapItem title="Incremental builds" status="exploring">

Cache rendered pages by content hash, so a large site only rebuilds the pages that changed.

    </RoadmapItem>
    <RoadmapItem title="A plugin surface" status="exploring">

Let projects add their own remark or rehype steps and custom components without forking the engine.

    </RoadmapItem>

</Roadmap>
