import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';

const MIME = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.ico': 'image/x-icon',
	'.bmp': 'image/bmp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.otf': 'font/otf',
	'.eot': 'application/vnd.ms-fontobject',
	'.mp4': 'video/mp4',
	'.webm': 'video/webm',
	'.mov': 'video/quicktime',
	'.mp3': 'audio/mpeg',
	'.wav': 'audio/wav',
	'.pdf': 'application/pdf'
};

const IGNORE = new Set([
	'node_modules',
	'.git',
	'.svelte-kit',
	'.vercel',
	'.netlify',
	'.wrangler',
	'dist',
	'build'
]);

export const isAsset = (path) => extname(path).toLowerCase() in MIME;

export const mimeFor = (path) => MIME[extname(path).toLowerCase()] ?? 'application/octet-stream';

export function resolveAsset(root, urlPath) {
	if (!root) return null;
	const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
	if (!clean || !isAsset(clean)) return null;
	const base = resolve(root);
	const file = resolve(base, clean);
	if (file !== base && !file.startsWith(base + sep)) return null;
	if (!existsSync(file) || !statSync(file).isFile()) return null;
	return file;
}

export function* walkAssets(root, extraIgnore = []) {
	if (!root || !existsSync(root)) return;
	const ignore = new Set([...IGNORE, ...extraIgnore]);
	const base = resolve(root);
	const stack = [base];
	while (stack.length) {
		const dir = stack.pop();
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			if (entry.name.startsWith('.')) continue;
			const full = join(dir, entry.name);
			if (entry.isDirectory()) {
				if (!ignore.has(entry.name)) stack.push(full);
			} else if (entry.isFile() && isAsset(entry.name)) {
				yield { file: full, rel: relative(base, full) };
			}
		}
	}
}
