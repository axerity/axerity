import { readFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { generateApiDocs } from '../dist/openapi.js';

const CONFIG = resolve(process.env.AXERITY_CONFIG ?? 'axerity.json');
const CONTENT_DIR = resolve(process.env.AXERITY_CONTENT_DIR ?? 'src/content/docs');

const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const openapi = config.openapi;
if (!openapi) process.exit(0);

const projectRoot = dirname(CONFIG);

const sources = (Array.isArray(openapi) ? openapi : [openapi]).map((entry) => {
	const source = typeof entry === 'string' ? { spec: entry } : { ...entry };
	if (source.spec && !/^https?:\/\//.test(source.spec) && !isAbsolute(source.spec)) {
		source.spec = resolve(projectRoot, source.spec);
	}
	return source;
});

const contentRoot = relative(process.cwd(), CONTENT_DIR) || CONTENT_DIR;
const written = await generateApiDocs(sources, contentRoot);
if (written.length) console.log(`  generated ${written.length} API reference files`);
