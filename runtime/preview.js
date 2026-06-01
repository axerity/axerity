import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const OUT = process.env.AXERITY_OUT ?? 'build';
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml',
	'.md': 'text/plain; charset=utf-8',
	'.ttf': 'font/ttf',
	'.woff2': 'font/woff2'
};

const resolveFile = (urlPath) => {
	const clean = decodeURIComponent(urlPath.split('?')[0]);
	const candidates = [join(OUT, clean)];
	if (existsSync(candidates[0]) && statSync(candidates[0]).isDirectory()) {
		candidates.push(join(candidates[0], 'index.html'));
	}
	candidates.push(join(OUT, `${clean}.html`));
	candidates.push(join(OUT, 'index.html'));
	return candidates.find((file) => existsSync(file) && statSync(file).isFile());
};

createServer((req, res) => {
	const file = resolveFile(req.url) ?? join(OUT, '404.html');
	if (!existsSync(file)) {
		res.statusCode = 404;
		res.end('Not found');
		return;
	}
	res.setHeader('content-type', TYPES[extname(file)] ?? 'application/octet-stream');
	res.end(readFileSync(file));
}).listen(PORT, () => console.log(`axerity preview → http://localhost:${PORT}`));
