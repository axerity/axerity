import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { generateApiDocs } from './src/lib/openapi/generate';

const allow = process.env.AXERITY_FS_ALLOW;

function openapi() {
	const localSpecs: string[] = [];
	const run = async () => {
		try {
			const openapi = JSON.parse(readFileSync('./axerity.json', 'utf8')).openapi;
			if (!openapi) return;
			const sources = (Array.isArray(openapi) ? openapi : [openapi]).map((o) =>
				typeof o === 'string' ? { spec: o } : o
			);
			localSpecs.length = 0;
			for (const s of sources) {
				if (s.spec && !/^https?:\/\//.test(s.spec)) localSpecs.push(resolve(s.spec));
			}
			await generateApiDocs(openapi, 'src/content/docs');
		} catch {
			return;
		}
	};
	return {
		name: 'axerity:openapi',
		async buildStart() {
			await run();
		},
		async configureServer(server: import('vite').ViteDevServer) {
			await run();
			for (const spec of localSpecs) server.watcher.add(spec);
			server.watcher.on('change', (file: string) => {
				if (localSpecs.includes(file)) run();
			});
		}
	};
}

export default defineConfig({
	plugins: [openapi(), tailwindcss(), sveltekit()],
	server: allow ? { fs: { strict: false } } : undefined
});
