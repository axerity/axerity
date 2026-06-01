---
title: Delete a pet
description: Delete a pet from the store.
icon: paw-print
layout: api
method: DELETE
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Delete a pet

Delete a pet.

<Api>

<Endpoint method="DELETE" path={'/pet/{petId}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Headers

<ParamField name="api_key" type="string">

Your store API key.

</ParamField>

## Path parameters

<ParamField name="petId" type="integer" required>

The id of the pet to delete.

</ParamField>

## Returns

<ResponseField name="code" type="integer">

The HTTP status code of the result.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X DELETE https://petstore3.swagger.io/api/v3/pet/10 \
  -H "api_key: special-key"
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "code": 200, "message": "Pet deleted" }
```

</ResponseExample>

<ResponseExample title="400 Invalid value">

```json
{ "code": 400, "message": "Invalid pet value" }
```

</ResponseExample>

</Api>
