import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { basename, relative, resolve } from 'node:path';
import chokidar from 'chokidar';
import { handler } from '../dist/handler.js';
import { mimeFor, resolveAsset } from './static.js';
import { brand, dim, formatDuration, lanAddress, strip, tty } from './ui.js';

const PORT = Number(process.env.PORT ?? 5173);
const CONTENT_DIR = resolve(process.env.AXERITY_CONTENT_DIR ?? 'src/content/docs');
const CONFIG = resolve(process.env.AXERITY_CONFIG ?? 'axerity.json');
const STATIC_DIR = process.env.AXERITY_STATIC_DIR;
const START = Number(process.env.AXERITY_START) || Date.now();

const clients = new Set();

const server = createServer((req, res) => {
	if (req.url === '/__axerity_livereload') {
		res.writeHead(200, {
			'content-type': 'text/event-stream',
			'cache-control': 'no-cache',
			connection: 'keep-alive'
		});
		res.write(':ok\n\n');
		clients.add(res);
		req.on('close', () => clients.delete(res));
		return;
	}
	const asset = req.method === 'GET' && resolveAsset(STATIC_DIR, req.url);
	if (asset) {
		res.writeHead(200, { 'content-type': mimeFor(asset), 'cache-control': 'no-cache' });
		createReadStream(asset).pipe(res);
		return;
	}
	handler(req, res, () => {
		res.statusCode = 404;
		res.end('Not found');
	});
});

const label = (path) => {
	if (resolve(path) === CONFIG) return 'axerity.json';
	const rel = relative(CONTENT_DIR, resolve(path));
	return rel && !rel.startsWith('..') ? rel : basename(path);
};

let timer = null;
let count = 0;
const changed = new Set();
const reload = () => {
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => {
		const files = [...changed];
		changed.clear();
		if (files.length > 25) return;
		count += 1;
		for (const res of clients) res.write('data: reload\n\n');
		const what = files.length === 1 ? label(files[0]) : `${files.length} files`;
		const line = `  ${brand('↻')}  ${dim('reloaded')} ${dim('·')} ${what} ${dim(`· ${count}×`)}`;
		if (tty) process.stdout.write(`\r\x1b[K${line}`);
		else process.stdout.write(`${strip(line)}\n`);
	}, 60);
};

chokidar.watch([CONTENT_DIR, CONFIG], { ignoreInitial: true }).on('all', (event, path) => {
	changed.add(path);
	reload();
});

server.listen(PORT, () => {
	const lan = lanAddress();
	const pad = (s) => dim(s.padEnd(9));
	process.stdout.write(`  ${dim('ready in')} ${formatDuration(Date.now() - START)}\n\n`);
	process.stdout.write(`  ${pad('Local')} ${brand(`http://localhost:${PORT}`)}\n`);
	if (lan) process.stdout.write(`  ${pad('Network')} ${brand(`http://${lan}:${PORT}`)}\n`);
	process.stdout.write(`\n  ${dim('watching for changes · Ctrl+C to stop')}\n\n`);
});
