---
title: Find pet by ID
description: Return a single pet.
icon: paw-print
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample } from '$lib';
</script>

# Find pet by ID

Returns a single pet.

<Api>

<Endpoint method="GET" path={'/pet/{petId}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Headers

<ParamField name="api_key" type="string">

Your store API key.

</ParamField>

## Path parameters

<ParamField name="petId" type="integer" required>

The id of the pet to return.

</ParamField>

## Returns

Returns the [Pet](/api/pet/pet-object).

<ResponseField name="id" type="integer">

Unique id for the pet.

</ResponseField>

<ResponseField name="name" type="string">

The pet's name.

</ResponseField>

<ResponseField name="status" type="enum">

Pet status in the store.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/pet/10 \
  -H "api_key: special-key"
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 10, "name": "doggie", "status": "available" }
```

</ResponseExample>

<ResponseExample title="404 Not Found">

```json
{ "code": 404, "message": "Pet not found" }
```

</ResponseExample>

<ObjectExample title="The Pet object">

```json
{
	"id": 10,
	"name": "doggie",
	"category": { "id": 1, "name": "Dogs" },
	"photoUrls": ["https://example.com/photos/doggie.png"],
	"tags": [{ "id": 1, "name": "friendly" }],
	"status": "available"
}
```

</ObjectExample>

</Api>
