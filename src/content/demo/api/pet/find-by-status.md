---
title: Find pets by status
description: Find pets filtered by status.
icon: paw-print
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, EnumValues, Enum } from '$lib';
</script>

# Find pets by status

Multiple status values can be provided as comma separated strings.

<Api>

<Endpoint method="GET" path="/pet/findByStatus" baseUrl="https://petstore3.swagger.io/api/v3" />

## Query parameters

<ParamField name="status" type="enum" default="available">

The status to filter by.

<EnumValues>
	<Enum value="available">Available for purchase.</Enum>
	<Enum value="pending">Reserved, sale in progress.</Enum>
	<Enum value="sold">Already sold.</Enum>
</EnumValues>

</ParamField>

## Returns

Returns an array of [Pet](/api/pet/pet-object) objects.

<ResponseField name="data" type="Pet[]">

The pets that match the status.

</ResponseField>

<RequestExample title="cURL">

```bash
curl "https://petstore3.swagger.io/api/v3/pet/findByStatus?status=available"
```

</RequestExample>

<ResponseExample title="200 OK">

```json
[
	{ "id": 10, "name": "doggie", "status": "available" },
	{ "id": 11, "name": "kitty", "status": "available" }
]
```

</ResponseExample>

<ResponseExample title="400 Invalid status">

```json
{ "code": 400, "message": "Invalid status value" }
```

</ResponseExample>

</Api>
