---
title: The User object
description: The shape of a User resource.
icon: user
layout: api
---

<script>
	import { Api, ResponseField, ObjectExample } from '$lib';
</script>

# The User object

A User is an account in the store.

<Api>

## Attributes

<ResponseField name="id" type="integer">

Unique id for the user.

</ResponseField>

<ResponseField name="username" type="string">

The user's login name.

</ResponseField>

<ResponseField name="firstName" type="string">

The user's first name.

</ResponseField>

<ResponseField name="lastName" type="string">

The user's last name.

</ResponseField>

<ResponseField name="email" type="string">

The user's email address.

</ResponseField>

<ResponseField name="password" type="string">

The user's password.

</ResponseField>

<ResponseField name="phone" type="string">

The user's phone number.

</ResponseField>

<ResponseField name="userStatus" type="integer">

The user status.

</ResponseField>

<ObjectExample title="The User object">

```json
{
	"id": 10,
	"username": "theUser",
	"firstName": "John",
	"lastName": "James",
	"email": "john@email.com",
	"password": "12345",
	"phone": "12345",
	"userStatus": 1
}
```

</ObjectExample>

</Api>
