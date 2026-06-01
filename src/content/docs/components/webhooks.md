---
title: Webhooks
description: Document the events your API sends to a customer's endpoint.
icon: webhook
---

<script>
	import { Webhook, EventList, Event, ResponseField, ResponseExample } from '$lib';
</script>

# Webhooks

Webhook docs read differently from endpoints: you are documenting an event your
service sends to the customer's server. The `Webhook` component lays out the
event, its payload, and an example, with the same sticky rail as the API kit.

## An event

<Webhook event="invoice.paid" method="POST" description="Sent when an invoice is paid in full.">

## Payload

<ResponseField name="id" type="string">

Unique id for the event.

</ResponseField>

<ResponseField name="type" type="string">

The event type, always `invoice.paid` here.

</ResponseField>

<ResponseField name="data" type="object">

The invoice that was paid.

</ResponseField>

<ResponseExample title="Example event">

```json
{
	"id": "evt_1abc",
	"type": "invoice.paid",
	"data": { "id": "in_9xy", "amount": 4200, "currency": "usd" }
}
```

</ResponseExample>

</Webhook>

## Usage

Wrap the event in `<Webhook>` and document the payload with `ResponseField`, then
add a `ResponseExample` (or `ObjectExample`) with a fenced code block for the
sample event:

```svelte
<Webhook event="invoice.paid" method="POST" description="Sent when an invoice is paid.">
	## Payload

	<ResponseField name="id" type="string">Unique id for the event.</ResponseField>

	<ResponseExample title="Example event">
		(a fenced json block with the sample payload)
	</ResponseExample>
</Webhook>
```

It works just like the [API components](/components/api), so any of
`ResponseField`, `ResponseExample`, and `ObjectExample` are available inside.

## Listing events

`EventList` renders an index of every event you send. Link each one to its
detail page.

<EventList>
	<Event name="invoice.paid" href="/components/webhooks">An invoice was paid in full.</Event>
	<Event name="invoice.payment_failed" href="/components/webhooks">A payment attempt failed.</Event>
	<Event name="customer.created" href="/components/webhooks">A new customer was created.</Event>
</EventList>

```svelte
<EventList>
	<Event name="invoice.paid" href="/webhooks/invoice-paid">An invoice was paid.</Event>
	<Event name="customer.created" href="/webhooks/customer-created">A customer was created.</Event>
</EventList>
```

## Props

### Webhook

| Prop          | Type     | Description                           |
| ------------- | -------- | ------------------------------------- |
| `event`       | `string` | The event type, e.g. `invoice.paid`   |
| `method`      | `string` | Delivery method (default `POST`)      |
| `description` | `string` | Short summary of when the event fires |

### Event

| Prop   | Type     | Description                     |
| ------ | -------- | ------------------------------- |
| `name` | `string` | The event type (required)       |
| `href` | `string` | Link to the event's detail page |
