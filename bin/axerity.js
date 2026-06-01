#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	symlinkSync,
	writeFileSync
} from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const engineRoot = resolve(here, '..');
const userRoot = process.cwd();
const isEngineRepo = userRoot === engineRoot;

const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';

const require = createRequire(import.meta.url);
function viteBin() {
	const pkgPath = require.resolve('vite/package.json');
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
	const rel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.vite;
	return resolve(dirname(pkgPath), rel);
}

// The engine runs in place, from its own install with its real node_modules. The
// user's project is mounted into a handful of gitignored paths for a single run,
// so nothing the engine tracks is ever touched — clean exit, Ctrl-C, or crash.
const ENGINE_DOCS = join(engineRoot, 'src', 'content', 'docs');
const ENGINE_CONFIG = join(engineRoot, 'axerity.json');
const ENGINE_STATIC = join(engineRoot, 'static');
const ENGINE_BUILD = join(engineRoot, 'build');
const SPECS_DIR = join(engineRoot, '.axerity-specs');
const ASSETS_DIR = join(engineRoot, '.axerity-assets');

function findContentDir() {
	for (const candidate of ['docs', join('content', 'docs'), 'content']) {
		const dir = join(userRoot, candidate);
		if (existsSync(dir)) return dir;
	}
	return null;
}

/** Reset the engine's own demo site into the mount points (for `axerity` runs
 *  from inside the engine repo). `pnpm dev` does this via its pre-scripts. */
function prepareEngine() {
	spawnSync(process.execPath, [join(engineRoot, 'scripts', 'prepare-engine.mjs')], {
		stdio: 'inherit'
	});
}

/** Copy local specs into a gitignored folder and rewrite the config to point at
 *  them, so the user's spec paths resolve without touching the engine tree. */
function mountSpecs(config) {
	const rewrite = (source) => {
		const spec = typeof source === 'string' ? source : source.spec;
		if (!spec || /^https?:\/\//.test(spec) || !existsSync(join(userRoot, spec))) return source;
		const local = `.axerity-specs/${basename(spec)}`;
		cpSync(join(userRoot, spec), join(engineRoot, local));
		return typeof source === 'string' ? local : { ...source, spec: local };
	};

	if (!config.openapi) return config;
	mkdirSync(SPECS_DIR, { recursive: true });
	const openapi = Array.isArray(config.openapi)
		? config.openapi.map(rewrite)
		: rewrite(config.openapi);
	return { ...config, openapi };
}

function mount(contentDir) {
	// Content -> the path the engine globs, as symlinks so generated pages (an API
	// reference) can sit alongside without touching the user's repo.
	rmSync(ENGINE_DOCS, { recursive: true, force: true });
	mkdirSync(ENGINE_DOCS, { recursive: true });
	for (const entry of readdirSync(contentDir)) {
		symlinkSync(join(contentDir, entry), join(ENGINE_DOCS, entry), symlinkType);
	}

	// Config (with local spec paths rewritten into the gitignored specs folder).
	const config = JSON.parse(readFileSync(join(userRoot, 'axerity.json'), 'utf8'));
	writeFileSync(ENGINE_CONFIG, JSON.stringify(mountSpecs(config), null, '\t'));

	// Assets: engine defaults overlaid with the user's public/ folder.
	rmSync(ASSETS_DIR, { recursive: true, force: true });
	cpSync(ENGINE_STATIC, ASSETS_DIR, { recursive: true });
	const userPublic = join(userRoot, 'public');
	if (existsSync(userPublic)) cpSync(userPublic, ASSETS_DIR, { recursive: true });
}

function tidy() {
	rmSync(SPECS_DIR, { recursive: true, force: true });
	rmSync(ASSETS_DIR, { recursive: true, force: true });
	rmSync(ENGINE_BUILD, { recursive: true, force: true });
}

const tty = process.stdout.isTTY;
const paint = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const dim = paint('2');
const bold = paint('1');
const red = paint('31');
const green = paint('32');
const brand = (s) => (tty ? `\x1b[38;2;124;108;246m${s}\x1b[0m` : s);
const mark = brand('◆');
const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

const banner = (sub) => process.stdout.write(`\n  ${mark} ${bold('axerity')} ${dim(sub)}\n\n`);

const NOISE =
	/^\s*(VITE v|➜|press h|ready in|Local:|Network:|\[vite\].*(optimiz|dependencies)|\[optimizer\]|Forced re-opt|watching for file changes|use --host)/i;

function streamServer(child, sub) {
	let shown = false;
	let buffer = '';
	const onData = (chunk) => {
		buffer += chunk;
		const lines = buffer.split('\n');
		buffer = lines.pop() ?? '';
		for (const line of lines) {
			const clean = strip(line);
			const url = clean.match(/Local:\s*(http:\/\/\S+)/);
			if (url && !shown) {
				shown = true;
				process.stdout.write(`  ${dim('ready at')}  ${brand(url[1])}\n`);
				process.stdout.write(`  ${dim('Ctrl+C to stop')}\n\n`);
				continue;
			}
			if (!clean.trim() || NOISE.test(clean.trim())) continue;
			process.stdout.write(`  ${line}\n`);
		}
	};
	child.stdout.on('data', onData);
	child.stderr.on('data', onData);
}

/** A build: silent spinner on success, full captured output only on failure. */
function streamBuild(child) {
	const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	let i = 0;
	let log = '';
	child.stdout.on('data', (d) => (log += d));
	child.stderr.on('data', (d) => (log += d));
	const timer = tty
		? setInterval(() => {
				process.stdout.write(`\r  ${brand(frames[(i = ++i % frames.length)])} ${dim('building…')}`);
			}, 80)
		: null;
	return {
		stop(ok) {
			if (timer) clearInterval(timer);
			if (tty) process.stdout.write('\r\x1b[K');
			if (!ok) process.stdout.write(log);
		}
	};
}

function runEngine(sub, extra, { mounted, onSuccess }) {
	const child = spawn(process.execPath, [viteBin(), sub, ...extra], {
		cwd: engineRoot,
		stdio: ['inherit', 'pipe', 'pipe'],
		env: {
			...process.env,
			...(mounted
				? { AXERITY_FS_ALLOW: userRoot, AXERITY_MOUNTED: '1', AXERITY_ASSETS: ASSETS_DIR }
				: {})
		}
	});

	banner(sub);
	const build = sub === 'build' ? streamBuild(child) : (streamServer(child, sub), null);

	let cleaned = false;
	const cleanup = () => {
		if (cleaned || !mounted) return;
		cleaned = true;
		tidy();
	};

	child.on('exit', (code) => {
		const ok = code === 0;
		if (build) build.stop(ok);
		if (ok && onSuccess) onSuccess();
		else if (!ok && sub !== 'build')
			process.stdout.write(`\n  ${red('✗')} exited with code ${code}\n`);
		cleanup();
		process.exit(code ?? 0);
	});

	process.on('SIGINT', () => child.kill('SIGINT'));
	process.on('SIGTERM', () => child.kill('SIGINT'));
	process.on('exit', cleanup);
}

function run(sub, extra) {
	// Inside the engine repo: serve its own demo site.
	if (isEngineRepo) {
		prepareEngine();
		return runEngine(sub, extra, { mounted: false });
	}

	if (!existsSync(join(userRoot, 'axerity.json'))) {
		console.error('No axerity.json found here. Run `axerity init` to create a starter site.');
		process.exit(1);
	}
	const contentDir = findContentDir();
	if (!contentDir) {
		console.error('No content found. Create a `docs/` folder with your Markdown.');
		process.exit(1);
	}

	mount(contentDir);

	if (sub === 'preview') {
		const built = join(userRoot, 'build');
		if (!existsSync(built)) {
			tidy();
			console.error('No build found. Run `axerity build` first.');
			process.exit(1);
		}
		cpSync(built, ENGINE_BUILD, { recursive: true });
	}

	const onSuccess =
		sub === 'build'
			? () => {
					const out = join(userRoot, 'build');
					rmSync(out, { recursive: true, force: true });
					cpSync(ENGINE_BUILD, out, { recursive: true });
					process.stdout.write(`  ${green('✓')} built ${dim('→')} ./build\n\n`);
				}
			: undefined;

	runEngine(sub, extra, { mounted: true, onSuccess });
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
	console.log(`Created an Axerity site in ${where}.\n`);
	console.log('Next:');
	if (where !== '.') console.log(`  cd ${where}`);
	console.log('  axerity dev');
}

const pkgVersion = () =>
	JSON.parse(readFileSync(join(engineRoot, 'package.json'), 'utf8')).version;

function help() {
	console.log(`Axerity ${pkgVersion()} — a documentation site generator\n`);
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
	case '--version':
	case '-v':
	case 'version':
		console.log(pkgVersion());
		break;
	case 'init':
		init();
		break;
	case 'dev':
		run('dev', extra);
		break;
	case 'build':
		run('build', extra);
		break;
	case 'preview':
		run('preview', extra);
		break;
	default:
		help();
		process.exit(command ? 1 : 0);
}
