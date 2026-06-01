const rawModules = import.meta.glob('/src/content/docs/**/*.md', {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

const BASE = '/src/content/docs';

function clean(markdown: string): string {
	return markdown
		.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
		.replace(/<script[\s\S]*?<\/script>\s*/g, '')
		.trim();
}

export async function getRawMarkdown(slug: string): Promise<string | null> {
	const rel = slug.replace(/\/+$/, '');
	const candidates = rel ? [`${BASE}/${rel}.md`, `${BASE}/${rel}/index.md`] : [`${BASE}/index.md`];
	const path = candidates.find((candidate) => candidate in rawModules);
	if (!path) return null;
	return clean(await rawModules[path]());
}
