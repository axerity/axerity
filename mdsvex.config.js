import { readFileSync } from 'node:fs';
import { defineMDSveXConfig } from 'mdsvex';
import { escapeSvelte } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import { createHighlighter } from 'shiki';
import { transformerTwoslash } from '@shikijs/twoslash';

let basePath = '';
try {
	basePath = JSON.parse(readFileSync('./axerity.json', 'utf8')).basePath ?? '';
} catch {
	// no config
}

function rehypeBasePath() {
	return (tree) => {
		const walk = (node) => {
			if (node.type === 'element' && node.tagName === 'a') {
				const href = node.properties?.href;
				if (
					typeof href === 'string' &&
					href.startsWith('/') &&
					!href.startsWith('//') &&
					!href.startsWith(`${basePath}/`)
				) {
					node.properties.href = basePath + href;
				}
			}
			node.children?.forEach(walk);
		};
		if (basePath) walk(tree);
	};
}

/**
 * Wrap every `<table>` in a `<div class="table-wrapper">` so it can be a rounded,
 * horizontally-scrollable card (a bare table can't clip rounded corners while
 * also scrolling on overflow).
 */
function rehypeTableWrapper() {
	return (tree) => {
		const walk = (node) => {
			if (!node.children) return;
			node.children = node.children.map((child) => {
				if (child.type === 'element' && child.tagName === 'table') {
					return {
						type: 'element',
						tagName: 'div',
						properties: { className: ['table-wrapper'] },
						children: [child]
					};
				}
				walk(child);
				return child;
			});
		};
		walk(tree);
	};
}

function rehypeExternalLinks() {
	return (tree) => {
		const walk = (node) => {
			if (node.type === 'element' && node.tagName === 'a') {
				const href = node.properties?.href;
				if (typeof href === 'string' && /^https?:\/\//.test(href)) {
					node.properties.target = '_blank';
					node.properties.rel = 'noreferrer noopener';
				}
			}
			node.children?.forEach(walk);
		};
		walk(tree);
	};
}

// Dual theme: light tokens are inlined, dark tokens exposed as CSS vars that
// `layout.css` switches on under `.dark`.
const themes = { light: 'github-light', dark: 'vesper' };

// Languages preloaded into the highlighter. Anything else falls back to plain
// text (see the try/catch below).
const langs = [
	'svelte',
	'typescript',
	'javascript',
	'json',
	'yaml',
	'bash',
	'shell',
	'html',
	'css',
	'markdown'
];

// Lazily create a single shared highlighter (loading grammars + themes is
// expensive, so do it once).
let highlighterPromise;
function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({ themes: Object.values(themes), langs });
	}
	return highlighterPromise;
}

/** Escape HTML special chars for safe interpolation into the title bar. */
function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Pull `title="…"` (or single-quoted) out of a fence's meta string. */
function parseTitle(meta) {
	const match = meta.match(/title=(?:"([^"]*)"|'([^']*)')/);
	return match ? (match[1] ?? match[2]) : null;
}

/**
 * Parse a `{1,3-5}` line-range expression from a fence's meta into a Set of
 * 1-based line numbers to highlight.
 */
function parseHighlightLines(meta) {
	const match = meta.match(/\{([\d,\s-]+)\}/);
	const lines = new Set();
	if (!match) return lines;
	for (const part of match[1].split(',')) {
		const range = part.trim();
		if (!range) continue;
		const [start, end] = range.split('-').map((n) => parseInt(n, 10));
		for (let i = start; i <= (end ?? start); i++) lines.add(i);
	}
	return lines;
}

/** Whether the fence asked for line numbers (```ts showLineNumbers). */
function hasLineNumbers(meta) {
	return /\bshowLineNumbers\b/.test(meta);
}

/** Whether the fence asked for Twoslash type annotations (```ts twoslash). */
function hasTwoslash(meta) {
	return /\btwoslash\b/.test(meta);
}

const twoslash = transformerTwoslash({ explicitTrigger: true });

/**
 * The YAML grammar gives the `---` document markers no scope, so they inherit
 * the bright default foreground and read as unhighlighted. Dim them to a subtle
 * token that adapts to both themes.
 */
function transformerDimYamlMarkers() {
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

/** Shiki transformer: tag the requested lines with a `highlighted` class. */
function transformerHighlightLines(lines) {
	return {
		name: 'axerity:highlight-lines',
		line(node, lineNumber) {
			if (lines.has(lineNumber)) this.addClassToHast(node, 'highlighted');
		}
	};
}

/**
 * Shiki separates lines with literal "\n" text nodes. With block-level lines
 * (needed for full-width highlights) those render as blank lines, so strip
 * them — the copy handler rejoins lines with newlines itself.
 */
function transformerRemoveLineBreaks() {
	return {
		name: 'axerity:remove-line-breaks',
		code(node) {
			node.children = node.children.filter(
				(child) => !(child.type === 'text' && child.value === '\n')
			);
		}
	};
}

/** Shiki transformer: flag the block so CSS counters can number the lines. */
function transformerLineNumbers() {
	return {
		name: 'axerity:line-numbers',
		pre(node) {
			this.addClassToHast(node, 'has-line-numbers');
		}
	};
}

// Static copy button injected into every code block; clicks are handled by a
// delegated listener in DocsLayout (the markup carries no state itself).
const COPY_BUTTON =
	'<button class="copy-button" type="button" aria-label="Copy code">' +
	'<svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>' +
	'<svg class="icon-check" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
	'</button>';

export default defineMDSveXConfig({
	extensions: ['.svx', '.md'],
	// Give every heading a stable id so the TOC can anchor + scroll-spy to it.
	rehypePlugins: [rehypeSlug, rehypeTableWrapper, rehypeExternalLinks, rehypeBasePath],
	highlight: {
		highlighter: async (code, lang, meta) => {
			if (lang === 'mermaid') {
				const graph = escapeSvelte(
					code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
				);
				return `{@html \`<pre class="mermaid">${graph}</pre>\`}`;
			}

			const highlighter = await getHighlighter();
			const language = (lang && highlighter.getLoadedLanguages().includes(lang) && lang) || 'text';
			meta = meta || '';

			const title = parseTitle(meta);
			const highlightLines = parseHighlightLines(meta);
			const twoslashEnabled = hasTwoslash(meta);

			const transformers = [];
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

			// With a title, the copy button lives in the header bar; otherwise it
			// floats in the top-right corner of the block.
			const header = title
				? `<div class="code-header"><span class="code-title">${escapeHtml(title)}</span>${COPY_BUTTON}</div>`
				: '';
			const blockClass =
				(title ? 'code-block has-header' : 'code-block') + (twoslashEnabled ? ' has-twoslash' : '');
			const floatingButton = title ? '' : COPY_BUTTON;
			const wrapped = `<div class="${blockClass}">${header}${floatingButton}${html}</div>`;

			// Escape so Svelte doesn't try to parse `{`, `}`, or backticks in the code.
			return `{@html \`${escapeSvelte(wrapped)}\`}`;
		}
	}
});
