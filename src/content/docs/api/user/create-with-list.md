---
title: Create users with list
description: Create several users at once.
icon: user
layout: api
method: POST
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Create users with list

Creates a list of users from a given input array.

<Api>

<Endpoint method="POST" path="/user/createWithList" baseUrl="https://petstore3.swagger.io/api/v3" />

## Body parameters

<ParamField name="users" type="array of User" typeLink="/docs/api/user/user-object">

The users to create.

</ParamField>

## Returns

Returns the first created [User](/docs/api/user/user-object).

<ResponseField name="id" type="integer">

Unique id for the user.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/user/createWithList \
  -H "Content-Type: application/json" \
  -d '[{ "username": "theUser", "email": "john@email.com" }]'
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "id": 10, "username": "theUser", "email": "john@email.com" }
```

</ResponseExample>

</Api>
