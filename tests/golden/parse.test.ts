import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '$lib/markdown/parse';

const cases: Record<string, string> = {
	'headings and inline marks':
		'# Title\n\n## Section\n\nSome **bold** and _italic_ text with a [link](/page).',
	'a callout with a markdown body': '<Callout type="warn">\n\nBe **careful** here.\n\n</Callout>',
	'a card group with props':
		'<CardGroup cols={2}>\n\n<Card title="A" href="/a">First</Card>\n\n<Card title="B" href="/b">Second</Card>\n\n</CardGroup>',
	'a list and a table': '- one\n- two\n\n| Head | Value |\n| ---- | ----- |\n| a | b |',
	'an external link and an image':
		'[site](https://example.com)\n\n<img src="/logo.png" alt="logo" />'
};

describe('parse golden snapshots', () => {
	for (const [name, input] of Object.entries(cases)) {
		it(name, async () => {
			const { doc } = await parseMarkdown(input);
			expect(doc).toMatchSnapshot();
		});
	}
});
