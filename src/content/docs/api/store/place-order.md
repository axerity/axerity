---
title: Place an order
description: Place an order for a pet.
icon: shopping-cart
layout: api
method: POST
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample } from '$lib';
</script>

# Place an order

Place a new order in the store.

<Api>

<Endpoint method="POST" path="/store/order" baseUrl="https://petstore3.swagger.io/api/v3" />

## Body parameters

<ParamField name="petId" type="integer">

The id of the pet to order.

</ParamField>

<ParamField name="quantity" type="integer">

How many to order.

</ParamField>

<ParamField name="status" type="enum">

The order status. One of `placed`, `approved`, or `delivered`.

</ParamField>

<ParamField name="complete" type="boolean">

Whether the order is complete.

</ParamField>

## Returns

Returns the created [Order](/docs/api/store/order-object).

<ResponseField name="id" type="integer">

Unique id for the order.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/store/order \
  -H "Content-Type: application/json" \
  -d '{ "petId": 198772, "quantity": 7, "status": "placed" }'
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 10, "petId": 198772, "quantity": 7, "status": "placed", "complete": false }
```

</ResponseExample>

<ResponseExample title="400 Invalid input">

```json
{ "code": 400, "message": "Invalid input" }
```

</ResponseExample>

</Api>
