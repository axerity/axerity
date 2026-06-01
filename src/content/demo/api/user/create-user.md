---
title: Create a user
description: Create a new user.
icon: user
layout: api
method: POST
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample } from '$lib';
</script>

# Create a user

This can only be done by a logged in user.

<Api>

<Endpoint method="POST" path="/user" baseUrl="https://petstore3.swagger.io/api/v3" />

## Body parameters

<ParamField name="username" type="string">

The user's login name.

</ParamField>

<ParamField name="email" type="string">

The user's email address.

</ParamField>

<ParamField name="password" type="string">

The user's password.

</ParamField>

## Returns

Returns the created [User](/api/user/user-object).

<ResponseField name="id" type="integer">

Unique id for the user.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/user \
  -H "Content-Type: application/json" \
  -d '{ "username": "theUser", "email": "john@email.com", "password": "12345" }'
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 10, "username": "theUser", "email": "john@email.com" }
```

</ResponseExample>

</Api>
