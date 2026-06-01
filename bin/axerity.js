#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const engineRoot = resolve(here, '..');
const userRoot = process.cwd();
const isEngineRepo = userRoot === engineRoot;

const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';

function findContentDir() {
	for (const candidate of ['docs', join('content', 'docs'), 'content']) {
		const dir = join(userRoot, candidate);
		if (existsSync(dir)) return dir;
	}
	return null;
}

function setupWorkspace() {
	const contentDir = findContentDir();
	if (!existsSync(join(userRoot, 'axerity.json'))) {
		console.error('No axerity.json found here. Run `axerity init` to create a starter site.');
		process.exit(1);
	}
	if (!contentDir) {
		console.error('No content found. Create a `docs/` folder with your Markdown.');
		process.exit(1);
	}

	const workDir = join(userRoot, '.axerity');
	mkdirSync(workDir, { recursive: true });

	// node_modules: link to the engine's installed deps (don't copy).
	const nodeModulesLink = join(workDir, 'node_modules');
	if (!existsSync(nodeModulesLink)) {
		symlinkSync(join(engineRoot, 'node_modules'), nodeModulesLink, symlinkType);
	}

	// Engine config files — copied so relative imports resolve in the workspace.
	for (const file of [
		'svelte.config.js',
		'vite.config.ts',
		'mdsvex.config.js',
		'tsconfig.json',
		'package.json',
		'axerity.schema.json'
	]) {
		const from = join(engineRoot, file);
		if (existsSync(from)) cpSync(from, join(workDir, file));
	}

	// Engine source, minus its demo content (the user's content is linked in).
	const engineSrc = join(engineRoot, 'src');
	const workSrc = join(workDir, 'src');
	rmSync(workSrc, { recursive: true, force: true });
	cpSync(engineSrc, workSrc, {
		recursive: true,
		filter: (src) => {
			const rel = relative(engineSrc, src);
			return rel !== 'content' && !rel.startsWith(`content${sep}`);
		}
	});

	// User content -> the path the engine globs.
	const contentMount = join(workSrc, 'content', 'docs');
	mkdirSync(dirname(contentMount), { recursive: true });
	rmSync(contentMount, { recursive: true, force: true });
	symlinkSync(contentDir, contentMount, symlinkType);

	// User config.
	cpSync(join(userRoot, 'axerity.json'), join(workDir, 'axerity.json'));

	// Static assets: engine defaults, then overlay the user's `public/`.
	const workStatic = join(workDir, 'static');
	rmSync(workStatic, { recursive: true, force: true });
	cpSync(join(engineRoot, 'static'), workStatic, { recursive: true });
	const userPublic = join(userRoot, 'public');
	if (existsSync(userPublic)) cpSync(userPublic, workStatic, { recursive: true });

	return { workDir, contentDir };
}

function runVite(sub, extra, { cwd, fsAllow, onSuccess }) {
	const viteEntry = join(engineRoot, 'node_modules', 'vite', 'bin', 'vite.js');
	const child = spawn(process.execPath, [viteEntry, sub, ...extra], {
		cwd,
		stdio: 'inherit',
		env: { ...process.env, ...(fsAllow ? { AXERITY_FS_ALLOW: fsAllow } : {}) }
	});
	child.on('exit', (code) => {
		if (code === 0 && onSuccess) onSuccess();
		process.exit(code ?? 0);
	});
}

function dev(sub, extra) {
	if (isEngineRepo) return runVite(sub, extra, { cwd: engineRoot });
	const { workDir, contentDir } = setupWorkspace();
	console.log(`axerity: serving ${relative(userRoot, contentDir) || '.'}\n`);

	// After a static build, lift the output out of the hidden workspace.
	const onSuccess =
		sub === 'build'
			? () => {
					const out = join(userRoot, 'build');
					rmSync(out, { recursive: true, force: true });
					cpSync(join(workDir, 'build'), out, { recursive: true });
					console.log(`\nStatic site written to ./build`);
				}
			: undefined;

	runVite(sub, extra, { cwd: workDir, fsAllow: userRoot, onSuccess });
}

function init() {
	const target = process.argv[3] ? resolve(userRoot, process.argv[3]) : userRoot;
	mkdirSync(join(target, 'docs'), { recursive: true });

	const files = {
		'axerity.json': `${JSON.stringify(
			{
				$schema: 'https://axerity.com/axerity.schema.json',
				name: 'My Docs',
				description: 'Documentation built with Axerity.',
				theme: 'neutral',
				topNav: [{ title: 'Docs', href: '/docs' }]
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
		'.gitignore': `.axerity\n`
	};

	for (const [file, content] of Object.entries(files)) {
		const path = join(target, file);
		if (existsSync(path)) continue;
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, content);
	}

	const where = relative(userRoot, target) || '.';
	console.log(`Created an Axerity site in ${where}.\n`);
	console.log('Next:');
	if (where !== '.') console.log(`  cd ${where}`);
	console.log('  axerity dev');
}

function help() {
	const { version } = JSON.parse(readFileSync(join(engineRoot, 'package.json'), 'utf8'));
	console.log(`Axerity ${version} — a documentation site generator\n`);
	console.log('Usage: axerity <command>\n');
	console.log('Commands:');
	console.log('  init [dir]   Scaffold a new docs site');
	console.log('  dev          Start the dev server');
	console.log('  build        Build the static site');
	console.log('  preview      Preview the production build');
	console.log('\nWrite Markdown in docs/ and configure the site in axerity.json.');
}

const command = process.argv[2];
const extra = process.argv.slice(3);

switch (command) {
	case 'init':
		init();
		break;
	case 'dev':
		dev('dev', extra);
		break;
	case 'build':
		dev('build', extra);
		break;
	case 'preview':
		dev('preview', extra);
		break;
	default:
		help();
		process.exit(command ? 1 : 0);
}
