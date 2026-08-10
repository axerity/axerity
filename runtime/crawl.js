import { createServer } from 'node:http';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { handler } from '../dist/handler.js';
import { walkAssets } from './static.js';
import { bold, brand, dim, dirSize, formatBytes, formatDuration, green, red, tty } from './ui.js';

const OUT = process.env.AXERITY_OUT ?? 'build';
const STATIC_DIR = process.env.AXERITY_STATIC_DIR;
const CONCURRENCY = Math.max(4, Math.min(16, availableParallelism()));

const start = Date.now();

const server = createServer((req, res) =>
	handler(req, res, () => {
		res.statusCode = 404;
		res.end('Not found');
	})
);
await new Promise((resolve) => server.listen(0, resolve));
const origin = `http://localhost:${server.address().port}`;
const get = (path) => fetch(origin + path);
const bytes = async (res) => Buffer.from(await res.arrayBuffer());

const write = (rel, data) => {
	const file = join(OUT, rel);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, data);
};

const failures = [];
async function fetchOk(path) {
	try {
		const res = await get(path);
		if (!res.ok) {
			failures.push({ path, reason: `HTTP ${res.status}` });
			return null;
		}
		return res;
	} catch (error) {
		failures.push({ path, reason: error.message });
		return null;
	}
}

async function pool(items, worker) {
	let cursor = 0;
	const run = async () => {
		while (cursor < items.length) await worker(items[cursor++]);
	};
	await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, run));
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('dist/client', OUT, { recursive: true });

if (STATIC_DIR) {
	for (const { file, rel } of walkAssets(STATIC_DIR, [basename(OUT)])) {
		const dest = join(OUT, rel);
		mkdirSync(dirname(dest), { recursive: true });
		cpSync(file, dest);
	}
}

const manifest = await (await get('/__manifest')).json();
const { base } = manifest;
const relOf = (path) => path.slice(base.length).replace(/^\//, '');

const total =
	manifest.pages.length + manifest.md.length + manifest.og.length + manifest.fixed.length;
let done = 0;
const tick = () => {
	done += 1;
	if (tty) process.stdout.write(`\r\x1b[K  ${brand('◆')} ${dim('building')} ${dim(`· ${done}/${total}`)}`);
};

await pool(manifest.pages, async (path) => {
	const rel = relOf(path);
	const res = await fetchOk(path);
	if (!res) return tick();
	write(rel === '' ? 'index.html' : `${rel}.html`, await bytes(res));
	const dataUrl = rel === '' ? `${base}/__data.json` : `${base}/${rel}/__data.json`;
	const dataRes = await get(dataUrl);
	if (dataRes.ok) write(rel === '' ? '__data.json' : `${rel}/__data.json`, await bytes(dataRes));
	tick();
});

await pool([...manifest.md, ...manifest.og, ...manifest.fixed], async (path) => {
	const res = await fetchOk(path);
	if (res) write(relOf(path), await bytes(res));
	tick();
});

write('404.html', await bytes(await get(`${base}/__axerity_not_found__`)));

server.close();

if (tty) process.stdout.write('\r\x1b[K');

if (failures.length) {
	process.stderr.write(
		`\n  ${red('✗')} build failed ${dim('·')} ${failures.length} of ${total} routes could not be rendered\n`
	);
	for (const { path, reason } of failures) {
		process.stderr.write(`    ${red('·')} ${relOf(path) || '/'} ${dim(`(${reason})`)}\n`);
	}
	process.stderr.write(`\n  ${dim('Fix the errors above and run the build again.')}\n\n`);
	process.exit(1);
}

const pages = manifest.pages.length;
const size = formatBytes(dirSize(OUT));
const elapsed = formatDuration(Date.now() - start);
const display = process.env.AXERITY_OUT_DISPLAY ?? `./${OUT}`;
process.stdout.write(
	`  ${green('✓')} ${bold('built')} ${pages} ${pages === 1 ? 'page' : 'pages'} ${dim(`· ${size} in ${elapsed}`)} ${dim('→')} ${display}\n\n`
);
