---
title: The Pet object
description: The shape of a Pet resource.
icon: paw-print
layout: api
---

<script>
	import { Api, ResponseField, ObjectExample, Expandable, EnumValues, Enum, Callout } from '$lib';
</script>

# The Pet object

A Pet is an animal listed in the store.

<Api>

<Callout type="info">

Pet endpoints are protected by `petstore_auth` (OAuth2) with the `read:pets` and
`write:pets` scopes. Reads also accept an `api_key` header.

</Callout>

## Attributes

<ResponseField name="id" type="integer">

Unique id for the pet. Read only.

</ResponseField>

<ResponseField name="name" type="string" required>

The pet's name, such as `doggie`.

</ResponseField>

<ResponseField name="category" type="Category">

The category this pet belongs to.

<Expandable title="properties">
	<ResponseField name="id" type="integer">

Category id.

    </ResponseField>
    <ResponseField name="name" type="string">

Category name, such as `Dogs`.

    </ResponseField>

</Expandable>

</ResponseField>

<ResponseField name="photoUrls" type="array of strings" required>

URLs of the pet's photos.

</ResponseField>

<ResponseField name="tags" type="array of Tag">

Tags attached to the pet.

<Expandable title="properties">
	<ResponseField name="id" type="integer">

Tag id.

    </ResponseField>
    <ResponseField name="name" type="string">

Tag name.

    </ResponseField>

</Expandable>

</ResponseField>

<ResponseField name="status" type="enum">

Pet status in the store.

<EnumValues>
	<Enum value="available">Available for purchase.</Enum>
	<Enum value="pending">Reserved, sale in progress.</Enum>
	<Enum value="sold">Already sold.</Enum>
</EnumValues>

</ResponseField>

<ObjectExample title="The Pet object">

```json
{
	"id": 10,
	"name": "doggie",
	"category": { "id": 1, "name": "Dogs" },
	"photoUrls": ["https://example.com/photos/doggie.png"],
	"tags": [{ "id": 1, "name": "friendly" }],
	"status": "available"
}
```

</ObjectExample>

</Api>
