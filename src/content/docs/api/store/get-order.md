---
title: Find order by ID
description: Return a single order.
icon: shopping-cart
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample } from '$lib';
</script>

# Find order by ID

For a valid response, try integer ids with a value of 5 or less. Other values
generate exceptions.

<Api>

<Endpoint method="GET" path={'/store/order/{orderId}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Path parameters

<ParamField name="orderId" type="integer" required>

The id of the order to fetch.

</ParamField>

## Returns

Returns the [Order](/docs/api/store/order-object).

<ResponseField name="id" type="integer">

Unique id for the order.

</ResponseField>

<ResponseField name="status" type="enum">

The order status.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/store/order/5
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 5, "petId": 198772, "quantity": 7, "status": "approved", "complete": true }
```

</ResponseExample>

<ResponseExample title="404 Not Found">

```json
{ "code": 404, "message": "Order not found" }
```

</ResponseExample>

</Api>
