---
title: Code Blocks
description: Fenced code with syntax highlighting, titles, and line highlighting.
icon: code
---

# Code Blocks

Fenced code blocks are written with triple backticks and a language hint, then
highlighted with [Shiki](https://shiki.style), light and dark themes follow
your color scheme automatically.

## Basic

````md
```ts
const greeting: string = 'Hello, Axerity';
console.log(greeting);
```
````

Renders as:

```ts
const greeting: string = 'Hello, Axerity';
console.log(greeting);
```

Hover any block to reveal the **copy** button in the corner.

## Titles

Add `title="…"` after the language to render a filename header bar:

````md
```ts title="hello.ts"
export function hello(name: string) {
	return `Hello, ${name}`;
}
```
````

```ts title="hello.ts"
export function hello(name: string) {
	return `Hello, ${name}`;
}
```

## Line highlighting

Add a `{…}` range to emphasize specific lines, single lines, comma lists, and
ranges all work:

````md
```ts title="server.ts" {2,4-6}
import { createServer } from 'node:http';

const server = createServer((req, res) => {
	res.writeHead(200);
	res.end('Hello from Axerity');
});

server.listen(3000);
```
````

```ts title="server.ts" {2,4-6}
import { createServer } from 'node:http';

const server = createServer((req, res) => {
	res.writeHead(200);
	res.end('Hello from Axerity');
});

server.listen(3000);
```

## Line numbers

Add `showLineNumbers` to number every line, it combines with titles and
highlighting:

````md
```ts showLineNumbers {3}
function fib(n) {
	if (n < 2) return n;
	return fib(n - 1) + fib(n - 2);
}
```
````

```ts showLineNumbers {3}
function fib(n) {
	if (n < 2) return n;
	return fib(n - 1) + fib(n - 2);
}
```

## Type hovers with Twoslash

Add `twoslash` to a TypeScript block to run it through the compiler at build
time. Tokens gain real type information you can hover, and a `^?` comment pops
the type of whatever sits above the caret:

````md
```ts twoslash
const user = {
	name: 'Ada',
	id: 1
};

user.name;
//   ^?
```
````

```ts twoslash
const user = {
	name: 'Ada',
	id: 1
};

user.name;
//   ^?
```

The code has to type check, so a Twoslash block doubles as a test that your
examples still compile.

## Svelte

Svelte is highlighted too, including the `<script>` block, markup, and bindings:

````md
```svelte
<script lang="ts">
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicked {count} times
</button>
```
````

```svelte
<script lang="ts">
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicked {count} times
</button>
```
