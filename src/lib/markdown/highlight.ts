import type { Highlighter, ShikiTransformer } from 'shiki';
import { bundledLanguages, createHighlighter } from 'shiki';
import { transformerTwoslash } from '@shikijs/twoslash';

const themes = { light: 'github-light', dark: 'vesper' } as const;

const langs = [
	'svelte',
	'typescript',
	'javascript',
	'jsx',
	'tsx',
	'json',
	'jsonc',
	'yaml',
	'toml',
	'ini',
	'bash',
	'shell',
	'powershell',
	'python',
	'go',
	'rust',
	'java',
	'kotlin',
	'swift',
	'c',
	'cpp',
	'csharp',
	'ruby',
	'php',
	'sql',
	'graphql',
	'html',
	'css',
	'scss',
	'xml',
	'markdown',
	'dockerfile',
	'diff',
	'http'
];

let highlighterPromise: ReturnType<typeof createHighlighter> | undefined;
function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({ themes: Object.values(themes), langs });
	}
	return highlighterPromise;
}

// Any code block whose language is not prebundled is loaded on demand, so every
// Shiki-supported language highlights instead of falling back to plain text.
async function ensureLanguage(highlighter: Highlighter, lang: string): Promise<string> {
	if (!lang) return 'text';
	if (highlighter.getLoadedLanguages().includes(lang)) return lang;
	if (lang in bundledLanguages) {
		try {
			await highlighter.loadLanguage(bundledLanguages[lang as keyof typeof bundledLanguages]);
			return lang;
		} catch {
			return 'text';
		}
	}
	return 'text';
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function parseTitle(meta: string): string | null {
	const match = meta.match(/title=(?:"([^"]*)"|'([^']*)')/);
	return match ? (match[1] ?? match[2]) : null;
}

function parseHighlightLines(meta: string): Set<number> {
	const match = meta.match(/\{([\d,\s-]+)\}/);
	const lines = new Set<number>();
	if (!match) return lines;
	for (const part of match[1].split(',')) {
		const range = part.trim();
		if (!range) continue;
		const [start, end] = range.split('-').map((n) => parseInt(n, 10));
		for (let i = start; i <= (end ?? start); i++) lines.add(i);
	}
	return lines;
}

const hasLineNumbers = (meta: string) => /\bshowLineNumbers\b/.test(meta);
const hasTwoslash = (meta: string) => /\btwoslash\b/.test(meta);

const twoslash = transformerTwoslash({ explicitTrigger: true });

function transformerDimYamlMarkers(): ShikiTransformer {
	return {
		name: 'axerity:dim-yaml-markers',
		span(node) {
			const text = node.children?.[0];
			if (text && text.type === 'text' && text.value.trim() === '---') {
				node.properties = { ...node.properties, style: 'color:var(--fg-subtle)' };
			}
		}
	};
}

function transformerHighlightLines(lines: Set<number>): ShikiTransformer {
	return {
		name: 'axerity:highlight-lines',
		line(node, lineNumber) {
			if (lines.has(lineNumber)) this.addClassToHast(node, 'highlighted');
		}
	};
}

function transformerRemoveLineBreaks(): ShikiTransformer {
	return {
		name: 'axerity:remove-line-breaks',
		code(node) {
			node.children = node.children.filter(
				(child) => !(child.type === 'text' && child.value === '\n')
			);
		}
	};
}

function transformerLineNumbers(): ShikiTransformer {
	return {
		name: 'axerity:line-numbers',
		pre(node) {
			this.addClassToHast(node, 'has-line-numbers');
		}
	};
}

const COPY_BUTTON =
	'<button class="copy-button" type="button" aria-label="Copy code">' +
	'<svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>' +
	'<svg class="icon-check" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
	'</button>';

export interface Highlighted {
	html: string;
	mermaid?: string;
}

export async function highlightCode(code: string, lang: string, meta = ''): Promise<Highlighted> {
	if (lang === 'mermaid') {
		const graph = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return { html: `<pre class="mermaid">${graph}</pre>`, mermaid: code };
	}

	const highlighter = await getHighlighter();
	const language = await ensureLanguage(highlighter, lang);

	const title = parseTitle(meta);
	const highlightLines = parseHighlightLines(meta);
	const twoslashEnabled = hasTwoslash(meta);

	const transformers: ShikiTransformer[] = [];
	if (twoslashEnabled) transformers.push(twoslash);
	if (language === 'yaml') transformers.push(transformerDimYamlMarkers());
	transformers.push(transformerRemoveLineBreaks());
	if (highlightLines.size) transformers.push(transformerHighlightLines(highlightLines));
	if (hasLineNumbers(meta)) transformers.push(transformerLineNumbers());

	const html = highlighter.codeToHtml(code, {
		lang: language,
		meta: { __raw: meta },
		themes,
		defaultColor: 'light',
		transformers
	});

	const header = title
		? `<div class="code-header"><span class="code-title">${escapeHtml(title)}</span>${COPY_BUTTON}</div>`
		: '';
	const blockClass =
		(title ? 'code-block has-header' : 'code-block') + (twoslashEnabled ? ' has-twoslash' : '');
	const floatingButton = title ? '' : COPY_BUTTON;
	return { html: `<div class="${blockClass}">${header}${floatingButton}${html}</div>` };
}
