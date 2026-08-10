import { readdirSync, statSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import { join } from 'node:path';

export const tty = process.stdout.isTTY;
const paint = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);

export const dim = paint('2');
export const bold = paint('1');
export const green = paint('32');
export const red = paint('31');
export const brand = (s) => (tty ? `\x1b[38;2;124;108;246m${s}\x1b[0m` : s);
export const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

export const banner = (sub) =>
	process.stdout.write(`\n  ${brand('◆')} ${bold('axerity')} ${dim(sub)}\n\n`);

export const formatDuration = (ms) =>
	ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;

export function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	const units = ['KB', 'MB', 'GB'];
	let value = bytes;
	let unit = -1;
	do {
		value /= 1024;
		unit += 1;
	} while (value >= 1024 && unit < units.length - 1);
	return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

export function dirSize(dir) {
	let total = 0;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) total += dirSize(path);
		else if (entry.isFile()) total += statSync(path).size;
	}
	return total;
}

export function lanAddress() {
	for (const list of Object.values(networkInterfaces())) {
		for (const net of list ?? []) {
			if (net.family === 'IPv4' && !net.internal) return net.address;
		}
	}
	return null;
}
