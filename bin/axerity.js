#!/usr/bin/env node
import { spawn } from 'node:child_process';

const commands = {
	dev: ['vite', 'dev'],
	build: ['vite', 'build'],
	preview: ['vite', 'preview'],
	check: ['svelte-kit', 'sync']
};

const command = process.argv[2];
const extra = process.argv.slice(3);

if (!command || !commands[command]) {
	console.log('Axerity, a documentation site generator\n');
	console.log('Usage: axerity <command>\n');
	console.log('Commands:');
	console.log('  dev      Start the dev server');
	console.log('  build    Build the static site');
	console.log('  preview  Preview the production build');
	console.log('\nEdit axerity.json to configure the site and drop Markdown into src/content/docs.');
	process.exit(command ? 1 : 0);
}

const [bin, ...args] = commands[command];
const child = spawn(bin, [...args, ...extra], { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
