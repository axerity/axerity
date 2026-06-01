---
title: Log in
description: Log a user into the system.
icon: user
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Log in

Log a user into the system. On success the response headers include rate limit
and token expiry information.

<Api>

<Endpoint method="GET" path="/user/login" baseUrl="https://petstore3.swagger.io/api/v3" />

## Query parameters

<ParamField name="username" type="string">

The user name for login.

</ParamField>

<ParamField name="password" type="string">

The password for login in clear text.

</ParamField>

## Returns

<ResponseField name="token" type="string">

A session token, returned as the response body.

</ResponseField>

<ResponseField name="X-Rate-Limit" type="integer">

Calls per hour allowed for the user. Returned as a response header.

</ResponseField>

<ResponseField name="X-Expires-After" type="string">

The date in UTC when the token expires. Returned as a response header.

</ResponseField>

<RequestExample title="cURL">

```bash
curl "https://petstore3.swagger.io/api/v3/user/login?username=theUser&password=12345"
```

</RequestExample>

<ResponseExample title="200 OK">

```json
"logged in user session: 1640995200000"
```

</ResponseExample>

<ResponseExample title="400 Bad Request">

```json
{ "code": 400, "message": "Invalid username/password supplied" }
```

</ResponseExample>

</Api>
