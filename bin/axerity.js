#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { banner, bold, brand, dim } from '../runtime/ui.js';

const here = dirname(fileURLToPath(import.meta.url));
const engineRoot = resolve(here, '..');
const userRoot = process.cwd();
const isEngineRepo = userRoot === engineRoot;

const DIST = join(engineRoot, 'dist');
const ASSETS = join(DIST, 'client');

function findContentDir() {
	for (const candidate of ['docs', join('content', 'docs'), 'content']) {
		const dir = join(userRoot, candidate);
		if (existsSync(dir)) return dir;
	}
	return null;
}

function findConfig() {
	for (const name of ['axerity.json', 'docs.json']) {
		const path = join(userRoot, name);
		if (existsSync(path)) return path;
	}
	return null;
}

function context() {
	if (isEngineRepo) {
		const contentDir = join(engineRoot, 'src', 'content', 'docs');
		return {
			contentDir,
			config: join(engineRoot, 'axerity.json'),
			staticDir: contentDir
		};
	}
	const config = findConfig();
	if (!config) {
		console.error(
			'No axerity.json or docs.json found here. Run `axerity init` to create a starter site.'
		);
		process.exit(1);
	}
	const contentDir = findContentDir();
	if (!contentDir) {
		console.error('No content found. Create a `docs/` folder with your Markdown.');
		process.exit(1);
	}
	return { contentDir, config, staticDir: userRoot };
}

function ensureDist() {
	if (existsSync(join(DIST, 'handler.js'))) return;
	console.error('The Axerity engine is not built. Run `pnpm build:engine` first.');
	process.exit(1);
}

function env(ctx, extra) {
	return {
		...process.env,
		AXERITY_CONTENT_DIR: ctx.contentDir,
		AXERITY_CONFIG: ctx.config,
		AXERITY_ASSETS: ASSETS,
		AXERITY_STATIC_DIR: ctx.staticDir,
		...extra
	};
}

function runScript(name, vars, onExit) {
	const child = spawn(process.execPath, [join(engineRoot, 'runtime', name)], {
		cwd: engineRoot,
		stdio: 'inherit',
		env: vars
	});
	process.on('SIGINT', () => child.kill('SIGINT'));
	process.on('SIGTERM', () => child.kill('SIGINT'));
	child.on('exit', (code) => {
		if (onExit) onExit(code ?? 0);
		process.exit(code ?? 0);
	});
}

function runStep(name, vars, cwd) {
	return new Promise((resolveStep) => {
		const child = spawn(process.execPath, [join(engineRoot, 'runtime', name)], {
			cwd,
			stdio: 'inherit',
			env: vars
		});
		child.on('exit', (code) => resolveStep(code ?? 0));
	});
}

function hasOpenapi(ctx) {
	if (isEngineRepo) return false;
	try {
		return Boolean(JSON.parse(readFileSync(ctx.config, 'utf8')).openapi);
	} catch {
		return false;
	}
}

async function generateOpenapi(ctx) {
	if (!hasOpenapi(ctx)) return;
	if (!existsSync(join(DIST, 'openapi.js'))) return;
	await runStep('openapi.js', env(ctx), userRoot);
}

async function dev() {
	ensureDist();
	banner('dev');
	const ctx = context();
	await generateOpenapi(ctx);
	runScript('serve.js', env(ctx, { AXERITY_DEV: '1', AXERITY_START: String(Date.now()) }));
}

async function build() {
	ensureDist();
	banner('build');
	const ctx = context();
	await generateOpenapi(ctx);
	runScript('crawl.js', env(ctx, { AXERITY_OUT: join(userRoot, 'build'), AXERITY_OUT_DISPLAY: './build' }));
}

function preview() {
	const out = join(userRoot, 'build');
	if (!existsSync(out)) {
		console.error('No build found. Run `axerity build` first.');
		process.exit(1);
	}
	banner('preview');
	runScript('preview.js', { ...process.env, AXERITY_OUT: out });
}

function init() {
	const target = process.argv[3] ? resolve(userRoot, process.argv[3]) : userRoot;
	mkdirSync(join(target, 'docs'), { recursive: true });

	const files = {
		'axerity.json': `${JSON.stringify(
			{
				$schema: 'https://unpkg.com/@axerity/cli/axerity.schema.json',
				name: 'My Docs',
				description: 'Documentation built with Axerity.',
				theme: 'neutral',
				topNav: [{ title: 'Docs', href: '/' }]
			},
			null,
			'\t'
		)}\n`,
		'docs/meta.json': `${JSON.stringify(
			{ title: 'Getting Started', icon: 'rocket', pages: ['index', 'quickstart'] },
			null,
			'\t'
		)}\n`,
		'docs/index.md': `---\ntitle: Introduction\ndescription: Welcome to your docs.\nicon: book-open\n---\n\n# Introduction\n\nWelcome to your new Axerity site. Edit \`docs/index.md\` to change this page.\n`,
		'docs/quickstart.md': `---\ntitle: Quick Start\ndescription: Get going in a minute.\nicon: rocket\n---\n\n# Quick Start\n\nRun \`axerity dev\` and start writing Markdown in the \`docs/\` folder.\n`,
		'.gitignore': `build\n`
	};

	for (const [file, content] of Object.entries(files)) {
		const path = join(target, file);
		if (existsSync(path)) continue;
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, content);
	}

	const where = relative(userRoot, target) || '.';
	process.stdout.write(
		`\n  ${brand('◆')} ${bold('axerity')} ${dim(`created a new site in ${where}`)}\n\n`
	);
	process.stdout.write(`  ${dim('Next steps')}\n`);
	if (where !== '.') process.stdout.write(`    ${dim('cd')} ${where}\n`);
	process.stdout.write(`    ${brand('axerity dev')}\n\n`);
}

const pkgVersion = () => JSON.parse(readFileSync(join(engineRoot, 'package.json'), 'utf8')).version;

function help() {
	const pad = (s) => s.padEnd(12);
	const commands = [
		['init [dir]', 'Scaffold a new docs site'],
		['dev', 'Start the dev server'],
		['build', 'Build the static site'],
		['preview', 'Preview the production build']
	];
	process.stdout.write(`\n  ${brand('◆')} ${bold('axerity')} ${dim(pkgVersion())}\n`);
	process.stdout.write(`  ${dim('a documentation site generator')}\n\n`);
	process.stdout.write(`  ${dim('Usage')}  axerity <command>\n\n`);
	process.stdout.write(`  ${dim('Commands')}\n`);
	for (const [name, desc] of commands) {
		process.stdout.write(`    ${bold(pad(name))} ${dim(desc)}\n`);
	}
	process.stdout.write(`\n  ${dim('Write Markdown in')} docs/ ${dim('· configure')} axerity.json\n\n`);
}

const command = process.argv[2];

switch (command) {
	case '--version':
	case '-v':
	case 'version':
		console.log(pkgVersion());
		break;
	case 'init':
		init();
		break;
	case 'dev':
		dev();
		break;
	case 'build':
		build();
		break;
	case 'preview':
		preview();
		break;
	default:
		help();
		process.exit(command ? 1 : 0);
}
