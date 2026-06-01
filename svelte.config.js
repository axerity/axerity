import { readFileSync } from 'node:fs';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import mdsvexConfig from './mdsvex.config.js';

// serve the site under a sub-path when `basePath` is set in axerity.json
let basePath = '';

try {
	basePath = JSON.parse(readFileSync('./axerity.json', 'utf8')).basePath ?? '';
} catch {
	// theres no config
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
		warningFilter: (warning) =>
			!(warning.code === 'script_context_deprecated' && /\.(md|svx)$/.test(warning.filename ?? ''))
	},
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		// Absolute base (not relative to the page) so `base` is a stable prefix
		// for both links and absolute URLs like OpenGraph images.
		paths: { base: basePath, relative: false }
	},
	preprocess: [mdsvex(mdsvexConfig)],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
