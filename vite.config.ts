import { existsSync, readFileSync, watch } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { generateApiDocs } from './src/lib/openapi/generate';

const mounted = !!process.env.AXERITY_FS_ALLOW;

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

function configReload() {
	const file = resolve('axerity.json');
	let watcher: ReturnType<typeof watch> | null = null;
	return {
		name: 'axerity:config-reload',
		configureServer(server: import('vite').ViteDevServer) {
			if (!existsSync(file)) return;
			let timer: ReturnType<typeof setTimeout> | null = null;
			watcher = watch(file, () => {
				if (timer) clearTimeout(timer);
				timer = setTimeout(() => server.watcher.emit('change', file), 50);
			});
		},
		closeBundle() {
			watcher?.close();
			watcher = null;
		}
	};
}

export default defineConfig({
	plugins: [
		openapi(),
		...(mounted ? [configReload()] : []),
		tailwindcss(),
		sveltekit()
	],
	server: mounted ? { fs: { strict: false } } : undefined,
	optimizeDeps: mounted ? { noDiscovery: true, include: ['@orama/orama', 'mermaid'] } : undefined
});
