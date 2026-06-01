---
title: WebSockets
description: Document channels and messages for WebSocket and AsyncAPI services.
icon: radio
---

<script>
	import { Channel, Message, ResponseField, ResponseExample } from '$lib';
</script>

# WebSockets

Event-driven APIs are documented as channels and messages, not requests and
responses. `Channel` lays out a connection and its messages with the same sticky
rail as the API kit, and `Message` marks the direction of each one.

## A channel

<Channel address={'/chat/{roomId}'} protocol="wss" server="wss://api.example.com" description="Real-time chat for a room.">

<Message direction="receive" name="message.created">

A new chat message arrived.

## Payload

<ResponseField name="id" type="string">

Unique id for the message.

</ResponseField>

<ResponseField name="body" type="string">

The message text.

</ResponseField>

<ResponseExample title="message.created">

```json
{ "id": "msg_1", "body": "hey there", "user": "ada" }
```

</ResponseExample>

</Message>

<Message direction="send" name="message.send">

Send a new message to the room.

## Payload

<ResponseField name="body" type="string" required>

The message text to send.

</ResponseField>

</Message>

</Channel>

## Usage

Wrap a channel in `<Channel>`, then mark each message with `<Message>` and
document its payload with `ResponseField` and `ResponseExample`:

```svelte
<Channel address="/chat/{roomId}" protocol="wss" server="wss://api.example.com">
	<Message direction="receive" name="message.created">
		## Payload

		<ResponseField name="body" type="string">The message text.</ResponseField>
	</Message>

	<Message direction="send" name="message.send">Send a message to the room.</Message>
</Channel>
```

`receive` is server-to-client, `send` is client-to-server (the AsyncAPI
`publish`/`subscribe` keywords work too).

## Props

### Channel

| Prop          | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `address`     | `string` | The channel or topic, e.g. `/chat/{roomId}`    |
| `protocol`    | `string` | `ws`, `wss`, `kafka`, `mqtt`, … (default `ws`) |
| `server`      | `string` | Base server URL, prepended to the address      |
| `description` | `string` | Short summary of the channel                   |

### Message

| Prop        | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `direction` | `string` | `send` or `receive` (or `publish`/`subscribe`) |
| `name`      | `string` | The message name, e.g. `message.created`       |
