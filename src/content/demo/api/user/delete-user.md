---
title: Delete a user
description: Delete an existing user.
icon: user
layout: api
method: DELETE
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Delete a user

This can only be done by a logged in user.

<Api>

<Endpoint method="DELETE" path={'/user/{username}'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Path parameters

<ParamField name="username" type="string" required>

The name of the user to delete.

</ParamField>

## Returns

<ResponseField name="code" type="integer">

The HTTP status code of the result.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X DELETE https://petstore3.swagger.io/api/v3/user/theUser
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "code": 200, "message": "User deleted" }
```

</ResponseExample>

<ResponseExample title="404 Not Found">

```json
{ "code": 404, "message": "User not found" }
```

</ResponseExample>

</Api>
