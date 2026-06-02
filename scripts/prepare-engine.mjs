#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';

const demo = join(root, 'src', 'content', 'demo');
const docs = join(root, 'src', 'content', 'docs');
const defaultConfig = join(root, 'axerity.default.json');
const config = join(root, 'axerity.json');
const schema = join(root, 'axerity.schema.json');

rmSync(docs, { recursive: true, force: true });
mkdirSync(docs, { recursive: true });
for (const entry of readdirSync(demo)) {
	symlinkSync(join(demo, entry), join(docs, entry), symlinkType);
}

if (existsSync(defaultConfig)) cpSync(defaultConfig, config);
if (existsSync(schema)) cpSync(schema, join(root, 'static', 'axerity.schema.json'));
