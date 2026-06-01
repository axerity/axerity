---
title: API reference
description: Generate a full API reference from an OpenAPI spec.
icon: webhook
---

<script>
	import { Callout } from '$lib';
</script>

# API reference

Point Axerity at an OpenAPI 3 spec and it generates the whole reference for you:
a page per operation with parameters, request and response bodies, examples, auth,
and a page per schema. The pages use the same [API components](/components/api)
you would write by hand, so they match the rest of your docs.

## Point at a spec

Add an `openapi` field to `axerity.json`. The simplest form is a path or URL:

```json title="axerity.json"
{
	"openapi": "./openapi.json"
}
```

The spec can be a local file or a URL, in JSON or YAML:

```json title="axerity.json"
{
	"openapi": "https://api.example.com/openapi.yaml"
}
```

Pages are written into your content tree the next time you run `axerity dev` or
`axerity build`, and they regenerate when a local spec changes.

<Callout type="info">

Generated pages are managed for you. They are added to `.gitignore` so they do
not clutter your repo, and they are rebuilt from the spec every time.

</Callout>

## Choose where it lands

Use the object form to set the output folder and the section title:

```json title="axerity.json"
{
	"openapi": {
		"spec": "./openapi.json",
		"output": "api-reference",
		"title": "API Reference"
	}
}
```

| Field    | Type   | What it does                                          |
| -------- | ------ | ----------------------------------------------------- |
| `spec`   | string | Local path or URL to an OpenAPI 3 spec (JSON or YAML) |
| `output` | string | Content folder for the generated pages                |
| `title`  | string | Section title (defaults to the spec's `info.title`)   |

With `output: "api-reference"`, an operation tagged `Pet` lands at
`/api-reference/pet/<operationId>` and each schema at
`/api-reference/schemas/<name>`.

## Group several specs

Pass an array to generate more than one reference, each into its own folder:

```json title="axerity.json"
{
	"openapi": [
		{ "spec": "./checkout.json", "output": "checkout-api", "title": "Checkout" },
		{ "spec": "./storefront.json", "output": "storefront-api", "title": "Storefront" }
	]
}
```

## Show it as a navbar tab

The generated pages are ordinary docs, so you surface them like any other area:
add a [dropdown](/configuration/navigation) that points at the output folder.
Clicking the tab swaps the sidebar to the API reference.

```json title="axerity.json"
{
	"dropdowns": [
		{
			"label": "API Reference",
			"icon": "code",
			"href": "/api-reference/pet/getpetbyid",
			"match": "/api-reference"
		}
	]
}
```

Set `href` to any page inside the folder (a good landing operation), and `match`
to the folder so the tab highlights while the reader is anywhere in the reference.
