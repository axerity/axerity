---
title: Add a new pet
description: Add a new pet to the store.
icon: paw-print
layout: api
method: POST
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample } from '$lib';
</script>

# Add a new pet

Add a new pet to the store.

<Api>

<Endpoint method="POST" path="/pet" baseUrl="https://petstore3.swagger.io/api/v3" />

## Body parameters

Create a new pet in the store.

<ParamField name="name" type="string" required>

The pet's name.

</ParamField>

<ParamField name="photoUrls" type="array of strings" required>

URLs of the pet's photos.

</ParamField>

<ParamField name="category" type="Category" typeLink="/docs/api/pet/pet-object">

The category this pet belongs to.

</ParamField>

<ParamField name="status" type="enum">

Pet status in the store. One of `available`, `pending`, or `sold`.

</ParamField>

## Returns

Returns the created [Pet](/docs/api/pet/pet-object).

<ResponseField name="id" type="integer">

Unique id for the new pet.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/pet \
  -H "Content-Type: application/json" \
  -d '{ "name": "doggie", "photoUrls": ["https://example.com/doggie.png"], "status": "available" }'
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{
	"id": 10,
	"name": "doggie",
	"photoUrls": ["https://example.com/doggie.png"],
	"status": "available"
}
```

</ResponseExample>

<ResponseExample title="400 Invalid input">

```json
{ "code": 400, "message": "Invalid input" }
```

</ResponseExample>

<ObjectExample title="The Pet object">

```json
{
	"id": 10,
	"name": "doggie",
	"category": { "id": 1, "name": "Dogs" },
	"photoUrls": ["https://example.com/doggie.png"],
	"tags": [{ "id": 1, "name": "friendly" }],
	"status": "available"
}
```

</ObjectExample>

</Api>
