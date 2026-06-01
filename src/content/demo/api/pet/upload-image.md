---
title: Upload an image
description: Upload an image of the pet.
icon: paw-print
layout: api
method: POST
---

<script>
	import { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample } from '$lib';
</script>

# Upload an image

Upload an image of the pet. The body is the raw image bytes.

<Api>

<Endpoint method="POST" path={'/pet/{petId}/uploadImage'} baseUrl="https://petstore3.swagger.io/api/v3" />

## Path parameters

<ParamField name="petId" type="integer" required>

The id of the pet to update.

</ParamField>

## Query parameters

<ParamField name="additionalMetadata" type="string">

Extra metadata to attach to the upload.

</ParamField>

## Body

The request body is the raw image (`application/octet-stream`).

## Returns

<ResponseField name="code" type="integer">

The HTTP status code.

</ResponseField>

<ResponseField name="type" type="string">

The result type.

</ResponseField>

<ResponseField name="message" type="string">

A message describing the result.

</ResponseField>

<RequestExample title="cURL">

```bash
curl -X POST "https://petstore3.swagger.io/api/v3/pet/10/uploadImage" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @doggie.png
```

</RequestExample>

<ResponseExample title="200 OK">

```json
{ "code": 200, "type": "success", "message": "Image uploaded" }
```

</ResponseExample>

</Api>
