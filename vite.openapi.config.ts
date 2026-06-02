import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		minify: false,
		target: 'node20',
		lib: {
			entry: 'src/lib/openapi/generate.ts',
			formats: ['es'],
			fileName: () => 'openapi.js'
		},
		rollupOptions: {
			external: [/^node:/, 'yaml']
		}
	}
});
