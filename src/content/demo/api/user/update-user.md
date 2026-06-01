---
title: Update a user
description: Update an existing user.
icon: user
layout: api
method: PUT
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Update a user

This can only be done by a logged in user.

<Api>

<Endpoint method="PUT" path={'/user/{username}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Path parameters

<ParamField name="username" type="string" required>

The name of the user to update.

</ParamField>

## Body parameters

<ParamField name="email" type="string">

The user's email address.

</ParamField>

<ParamField name="password" type="string">

The user's password.

</ParamField>

## Returns

<ResponseField name="code" type="integer">

The HTTP status code of the result.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X PUT https://petstore3.swagger.io/api/v3/user/theUser \
  -H "Content-Type: application/json" \
  -d '{ "email": "new@email.com" }'
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "code": 200, "message": "ok" }
```

</ResponseExample>

</Api>
