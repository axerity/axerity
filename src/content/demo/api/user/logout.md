---
title: Log out
description: Log out the current session.
icon: user
layout: api
method: GET
---

<script>
	import { Api, Endpoint, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Log out

Log the current user out of the system.

<Api>

<Endpoint method="GET" path="/user/logout" baseUrl="https://petstore3.swagger.io/api/v3" />

## Returns

<ResponseField name="code" type="integer">

The HTTP status code of the result.

</ResponseField>

<RequestExample title="cURL">

```bash
curl https://petstore3.swagger.io/api/v3/user/logout
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "code": 200, "message": "ok" }
```

</ResponseExample>

</Api>
