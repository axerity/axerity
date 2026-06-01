---
title: Releasing
description: How a version is cut and published.
icon: package
---

# Releasing

A release is a version bump and a git tag. Everything else is automated.

```bash
pnpm version patch
```

This bumps the version in `package.json`, commits it, tags it, and pushes the tag. The tag push triggers the publish workflow in `.github/workflows/publish.yml`, which type checks, compiles the engine, and publishes to npm with provenance.

<Steps>
	<Step title="Check">

The workflow runs `pnpm check` so a type error never ships.

	</Step>
	<Step title="Compile">

It runs `pnpm build:engine`, which produces a fresh `dist/`. The compiled engine is built in CI, not committed to the repository.

	</Step>
	<Step title="Publish">

It runs `pnpm publish` with provenance, so the package is signed and traceable to the commit it came from.

	</Step>
</Steps>

## What ships

The published package contains the prebuilt engine, the CLI, and the runtime scripts. It does not contain the source. A consumer installs the compiled `dist/` and runs it over their own content.

<Callout type="info">
`dist/` is gitignored and rebuilt in CI on every release. Git only ever tracks source. npm only ever ships the built artifact.
</Callout>

Use `patch` for fixes, `minor` for features or larger changes, and a prerelease version when you want something on npm without moving the default tag.
