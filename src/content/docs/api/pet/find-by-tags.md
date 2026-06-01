---
title: Find pets by tags
description: Find pets filtered by tags.
icon: paw-print
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Find pets by tags

Multiple tags can be provided as comma separated strings. Use `tag1`, `tag2`,
`tag3` for testing.

<Api>

<Endpoint method="GET" path="/pet/findByTags" baseUrl="https://petstore3.swagger.io/api/v3" />

## Query parameters

<ParamField name="tags" type="array of strings">

Tags to filter by.

</ParamField>

## Returns

Returns an array of [Pet](/docs/api/pet/pet-object) objects.

<ResponseField name="data" type="Pet[]">

The pets that match the tags.

</ResponseField>

<RequestExample title="cURL">

```bash
curl "https://petstore3.swagger.io/api/v3/pet/findByTags?tags=friendly"
```

</RequestExample>

<ResponseExample title="200 OK">

```json
[{ "id": 10, "name": "doggie", "tags": [{ "id": 1, "name": "friendly" }] }]
```

</ResponseExample>

<ResponseExample title="400 Invalid tag">

```json
{ "code": 400, "message": "Invalid tag value" }
```

</ResponseExample>

</Api>
