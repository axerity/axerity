// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { registry } from '$lib/markdown/registry';

const props = {
	title: 'Title',
	name: 'field',
	method: 'GET',
	path: '/pets/{id}',
	type: 'info',
	label: 'Label',
	event: 'order.created',
	address: '/socket',
	server: 'wss://example.test',
	cols: 2,
	status: 'shipped',
	icon: 'box',
	href: '/somewhere',
	caption: 'A caption',
	color: 'success',
	src: 'https://example.test/video.mp4'
};

const CONTEXT_CHILDREN = new Set(['RequestExample', 'ResponseExample', 'ObjectExample', 'Tab']);

describe('kit components survive self-closing usage (no children)', () => {
	for (const name of Object.keys(registry)) {
		if (CONTEXT_CHILDREN.has(name)) continue;
		it(`<${name} /> renders with no children`, () => {
			expect(() => render(registry[name] as never, { props })).not.toThrow();
		});
	}
});
