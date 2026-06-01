---
title: Update an existing pet
description: Update an existing pet by id.
icon: paw-print
layout: api
method: PUT
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample } from '$lib';
</script>

# Update an existing pet

Update an existing pet by id.

<Api>

<Endpoint method="PUT" path="/pet" baseUrl="https://petstore3.swagger.io/api/v3" />

## Body parameters

Update an existent pet in the store.

<ParamField name="id" type="integer" required>

The id of the pet to update.

</ParamField>

<ParamField name="name" type="string" required>

The pet's name.

</ParamField>

<ParamField name="status" type="enum">

Pet status in the store. One of `available`, `pending`, or `sold`.

</ParamField>

## Returns

Returns the updated [Pet](/api/pet/pet-object).

<ResponseField name="id" type="integer">

Unique id for the pet.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X PUT https://petstore3.swagger.io/api/v3/pet \
  -H "Content-Type: application/json" \
  -d '{ "id": 10, "name": "doggie", "status": "sold" }'
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 10, "name": "doggie", "status": "sold" }
```

</ResponseExample>

<ResponseExample title="404 Not Found">

```json
{ "code": 404, "message": "Pet not found" }
```

</ResponseExample>

</Api>
