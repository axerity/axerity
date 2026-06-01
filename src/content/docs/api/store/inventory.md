---
title: Get inventory
description: Pet inventories by status.
icon: shopping-cart
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Get inventory

Returns a map of status codes to quantities.

<Api>

<Endpoint method="GET" path="/store/inventory" baseUrl="https://petstore3.swagger.io/api/v3" />

## Headers

<ParamField name="api_key" type="string">

Your store API key.

</ParamField>

## Returns

<ResponseField name="data" type="object">

A map of status names to the number of pets with that status.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/store/inventory \
  -H "api_key: special-key"
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "available": 12, "pending": 3, "sold": 8 }
```

</ResponseExample>

</Api>
