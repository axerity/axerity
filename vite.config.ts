import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const allow = process.env.AXERITY_FS_ALLOW;

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: allow ? { fs: { allow: ['.', allow] } } : undefined
});
