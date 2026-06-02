# Contributing

## Tests

Run `pnpm test` before pushing. The suite (vitest) has three layers:

- **Unit** (`tests/unit`) covers the pure pipeline: the parser, the attribute grammar, the navigation tree and matcher, config normalization, the static asset helper, and OpenAPI generation.
- **Component** (`tests/components`) renders the kit through `Markdown.svelte` and asserts that no component crashes on self-closing usage or during teardown.
- **Integration** (`tests/integration`) runs a real build against a fixture and asserts that a broken page fails the build with a non-zero exit.

Two rules keep the suite honest:

1. **Every bug fix lands with a regression test.** Reproduce the bug as a failing test first, then fix it. The test is what stops it from coming back.
2. **Every new kit component lands with a render test.** The data-driven test in `tests/components/kit-children.test.ts` already renders every registered component with no children, so a new component is covered against the self-closing crash as soon as it is in the registry. Add a focused test for any behavior beyond rendering.

CI runs `pnpm check`, `pnpm lint`, `pnpm build:engine`, and `pnpm test` on every pull request, and the same before a release, so a failing test cannot ship.
