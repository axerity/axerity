import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const { renderOgImage } = await import('$lib/server/og');

const fontDir = join(process.cwd(), 'static', 'fonts');
const fonts = ([400, 600, 700] as const).map((weight) => {
	const buf = readFileSync(join(fontDir, `geist-${weight}.ttf`));
	return {
		data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
		weight
	};
});

describe('renderOgImage', () => {
	it('renders a 1200x630 png', async () => {
		const png = await renderOgImage({
			title: 'Hello World',
			description: 'A test card.',
			siteName: 'Test',
			eyebrow: 'Section',
			og: { background: '#0a0a0a', foreground: '#ffffff', muted: '#a1a1a1', accent: '#2bd576' },
			fonts
		});
		const buf = Buffer.from(png);
		expect(buf.subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
		expect(buf.readUInt32BE(16)).toBe(1200);
		expect(buf.readUInt32BE(20)).toBe(630);
	});

	it('renders without a description or eyebrow', async () => {
		const png = await renderOgImage({ title: 'Just a title', siteName: 'Test', fonts });
		expect(Buffer.from(png).subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
	});
});
