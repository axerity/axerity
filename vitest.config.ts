import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { fileURLToPath } from 'node:url';

const alias = {
	$lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
	'$app/paths': fileURLToPath(new URL('./tests/mocks/app-paths.ts', import.meta.url)),
	'$app/environment': fileURLToPath(new URL('./tests/mocks/app-environment.ts', import.meta.url)),
	'$app/state': fileURLToPath(new URL('./tests/mocks/app-state.ts', import.meta.url)),
	'$app/navigation': fileURLToPath(new URL('./tests/mocks/app-navigation.ts', import.meta.url))
};

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			include: [
				'src/lib/markdown/**',
				'src/lib/content/**',
				'src/lib/openapi/generate.ts',
				'src/lib/nav-match.ts',
				'runtime/static.js'
			],
			thresholds: { statements: 80, lines: 80, functions: 80, branches: 60 }
		},
		projects: [
			{
				resolve: { alias },
				test: {
					name: 'unit',
					environment: 'node',
					include: ['tests/{unit,integration,golden}/**/*.test.ts']
				}
			},
			{
				plugins: [svelte(), svelteTesting()],
				resolve: { alias },
				test: {
					name: 'components',
					environment: 'jsdom',
					include: ['tests/components/**/*.test.ts'],
					setupFiles: ['tests/setup-jsdom.ts']
				}
			}
		]
	}
});
