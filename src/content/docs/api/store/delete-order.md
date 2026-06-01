---
title: Delete an order
description: Delete a purchase order by id.
icon: shopping-cart
layout: api
method: DELETE
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Delete an order

For a valid response, try integer ids with a value under 1000. Anything above
1000 or non-integers generate errors.

<Api>

<Endpoint method="DELETE" path={'/store/order/{orderId}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Path parameters

<ParamField name="orderId" type="integer" required>

The id of the order to delete.

</ParamField>

## Returns

<ResponseField name="code" type="integer">

The HTTP status code of the result.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X DELETE https://petstore3.swagger.io/api/v3/store/order/10
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "code": 200, "message": "Order deleted" }
```

</ResponseExample>

<ResponseExample title="404 Not Found">

```json
{ "code": 404, "message": "Order not found" }
```

</ResponseExample>

</Api>
