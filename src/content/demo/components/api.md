---
title: API components
description: Document REST endpoints with fields, examples, and schemas.
icon: code
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample, Expandable, EnumValues, Enum } from '$lib';
</script>

# API components

These components build a reference for a REST API. Set `layout: api` in the page
frontmatter to get the wide, two-column layout where examples sit in a sticky
rail on the right.

## Writing an API page

Here is a complete page. Set `layout: api`, import the components you need, wrap
the body in `<Api>`, and leave blank lines around each component so the Markdown
inside is parsed:

````md
---
title: Create a pet
layout: api
method: POST
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, EnumValues, Enum } from '$lib';
</script>

# Create a pet

<Api>

<Endpoint method="POST" path="/pets" baseUrl="https://api.example.com/v1" />

## Body parameters

<ParamField name="name" type="string" required>

The pet's name.

</ParamField>

<ParamField name="status" type="string" default="available">

<EnumValues>
	<Enum value="available">Ready to be adopted.</Enum>
	<Enum value="pending">Adoption in progress.</Enum>
</EnumValues>

</ParamField>

## Returns

<ResponseField name="id" type="integer">

The unique id of the created pet.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X POST https://api.example.com/v1/pets -d '{ "name": "Rex" }'
```

</RequestExample>

<ResponseExample title="201 Created">

```json
{ "id": 10, "name": "Rex", "status": "available" }
```

</ResponseExample>

</Api>
````

A few things to know:

- The `method` in frontmatter is what shows as the colored badge in the sidebar.
- Headings (`## Body parameters`) become the section labels; the fields below
  each heading line up with the example rail on the right.
- For a path parameter in braces, write it as an expression so Svelte does not
  treat it as markup: `path={'/pets/{petId}'}`.

That page renders like the example below.

## Example

<Api>

<Endpoint method="POST" path="/pets" baseUrl="https://api.example.com/v1" />

## Body parameters

<ParamField name="name" type="string" required>

The pet's name.

</ParamField>

<ParamField name="status" type="string" default="available">

<EnumValues>
	<Enum value="available">Ready to be adopted.</Enum>
	<Enum value="pending">Adoption in progress.</Enum>
</EnumValues>

</ParamField>

## Returns

<ResponseField name="id" type="integer">

The unique id of the created pet.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X POST https://api.example.com/v1/pets -d '{ "name": "Rex" }'
```

</RequestExample>

<ResponseExample title="201 Created">

```json
{ "id": 10, "name": "Rex", "status": "available" }
```

</ResponseExample>

</Api>

## Components

| Component                            | Purpose                                            |
| ------------------------------------ | -------------------------------------------------- |
| `Api`                                | Wraps a page so examples float into the right rail |
| `Endpoint`                           | The method + path header with a copy button        |
| `ParamField` / `ResponseField`       | A single parameter or response field               |
| `RequestExample` / `ResponseExample` | A titled code example in the rail                  |
| `ObjectExample`                      | A titled object/schema example in the rail         |
| `Expandable`                         | A collapsible group for nested fields              |
| `EnumValues` / `Enum`                | A list of allowed values for a field               |

## Endpoint

| Prop      | Type     | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `method`  | `string` | HTTP method (default `GET`)                 |
| `path`    | `string` | Request path; `{param}` segments are styled |
| `baseUrl` | `string` | Base URL shown before the path              |

Path parameters in braces need an expression so Svelte does not read them as
markup: `path={'/pets/{petId}'}`.

## ParamField and ResponseField

| Prop         | Type      | Description                      |
| ------------ | --------- | -------------------------------- |
| `name`       | `string`  | Field name (required)            |
| `type`       | `string`  | Field type, for example `string` |
| `typeLink`   | `string`  | Link the type to another page    |
| `required`   | `boolean` | Mark the field required          |
| `deprecated` | `boolean` | Mark the field deprecated        |
| `default`    | `string`  | Default value                    |

The content between the tags is the field's description, and can hold nested
`Expandable` groups or an `EnumValues` list.

## Examples in the rail

`RequestExample`, `ResponseExample`, and `ObjectExample` each take an optional
`title` and render in the right-hand rail next to the fields they describe.
`Expandable` takes a `title` and an `open` boolean. `Enum` takes the allowed
`value`.
