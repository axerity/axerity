---
title: Update a pet with form data
description: Update a pet using query parameters.
icon: paw-print
layout: api
method: POST
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Update a pet with form data

Updates a pet resource based on the form data.

<Api>

<Endpoint method="POST" path={'/pet/{petId}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Path parameters

<ParamField name="petId" type="integer" required>

The id of the pet that needs to be updated.

</ParamField>

## Query parameters

<ParamField name="name" type="string">

The new name of the pet.

</ParamField>

<ParamField name="status" type="string">

The new status of the pet.

</ParamField>

## Returns

Returns the updated [Pet](/api/pet/pet-object).

<ResponseField name="id" type="integer">

Unique id for the pet.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X POST "https://petstore3.swagger.io/api/v3/pet/10?name=doggie&status=sold"
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 10, "name": "doggie", "status": "sold" }
```

</ResponseExample>

</Api>
