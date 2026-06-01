---
title: Get user by username
description: Return a single user.
icon: user
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample } from '$lib';
</script>

# Get user by username

Get user details based on the username. Use `user1` for testing.

<Api>

<Endpoint method="GET" path={'/user/{username}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Path parameters

<ParamField name="username" type="string" required>

The name of the user to fetch.

</ParamField>

## Returns

Returns the [User](/docs/api/user/user-object).

<ResponseField name="id" type="integer">

Unique id for the user.

</ResponseField>

<ResponseField name="username" type="string">

The user's login name.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/user/user1
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 10, "username": "user1", "email": "john@email.com" }
```

</ResponseExample>

<ResponseExample title="404 Not Found">

```json
{ "code": 404, "message": "User not found" }
```

</ResponseExample>

</Api>
