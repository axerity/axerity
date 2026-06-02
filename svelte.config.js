import { readFileSync } from 'node:fs';
import adapter from '@sveltejs/adapter-node';

let basePath;

try {
	basePath = JSON.parse(readFileSync('./axerity.json', 'utf8')).basePath ?? '';
} catch {
	basePath = '';
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ out: 'dist', precompress: false }),
		// The CLI points this at a gitignored merge of the engine's static assets
		// and the user's public/ folder, so the tracked static/ is never touched.
		files: { assets: process.env.AXERITY_ASSETS || 'static' },
		// Absolute base (not relative to the page) so `base` is a stable prefix
		// for both links and absolute URLs like OpenGraph images.
		paths: { base: basePath, relative: false }
	},
	extensions: ['.svelte']
};

export default config;
