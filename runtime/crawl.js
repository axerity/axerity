import { createServer } from 'node:http';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { handler } from '../dist/handler.js';

const OUT = process.env.AXERITY_OUT ?? 'build';

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

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('dist/client', OUT, { recursive: true });

const manifest = await (await get('/__manifest')).json();
const { base } = manifest;
const relOf = (path) => path.slice(base.length).replace(/^\//, '');

for (const path of manifest.pages) {
	const rel = relOf(path);
	write(rel === '' ? 'index.html' : `${rel}.html`, await bytes(await get(path)));
	const dataUrl = rel === '' ? `${base}/__data.json` : `${base}/${rel}/__data.json`;
	const dataRes = await get(dataUrl);
	if (dataRes.ok) write(rel === '' ? '__data.json' : `${rel}/__data.json`, await bytes(dataRes));
}

for (const path of [...manifest.md, ...manifest.og, ...manifest.fixed]) {
	write(relOf(path), await bytes(await get(path)));
}

write('404.html', await bytes(await get(`${base}/__axerity_not_found__`)));

server.close();
console.log(`crawled ${manifest.pages.length} pages to ./${OUT}`);
