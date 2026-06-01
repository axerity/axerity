interface Prefixed {
	href: string;
	match?: string;
}

function base(item: Prefixed): string {
	return item.match ?? item.href;
}

export function activeFor<T extends Prefixed>(path: string, items: T[]): T | undefined {
	let best: T | undefined;
	let bestLength = -1;
	for (const item of items) {
		const prefix = base(item);
		if (path === prefix || path.startsWith(prefix.endsWith('/') ? prefix : prefix + '/')) {
			if (prefix.length > bestLength) {
				best = item;
				bestLength = prefix.length;
			}
		}
	}
	return best;
}
