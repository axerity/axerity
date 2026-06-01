---
title: The Order object
description: The shape of a store Order.
icon: shopping-cart
layout: api
---

<script>
	import { Api, ResponseField, ObjectExample, EnumValues, Enum } from '$lib';
</script>

# The Order object

An Order is a purchase placed in the store.

<Api>

## Attributes

<ResponseField name="id" type="integer">

Unique id for the order.

</ResponseField>

<ResponseField name="petId" type="integer">

The id of the pet being ordered.

</ResponseField>

<ResponseField name="quantity" type="integer">

How many of the pet are ordered.

</ResponseField>

<ResponseField name="shipDate" type="string">

When the order ships, as a date-time.

</ResponseField>

<ResponseField name="status" type="enum">

The order status.

<EnumValues>
	<Enum value="placed">The order has been placed.</Enum>
	<Enum value="approved">The order has been approved.</Enum>
	<Enum value="delivered">The order has been delivered.</Enum>
</EnumValues>

</ResponseField>

<ResponseField name="complete" type="boolean">

Whether the order is complete.

</ResponseField>

<ObjectExample title="The Order object">

```json
{
	"id": 10,
	"petId": 198772,
	"quantity": 7,
	"shipDate": "2024-01-01T10:00:00Z",
	"status": "approved",
	"complete": true
}
```

</ObjectExample>

</Api>
