import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parse as parseYaml } from 'yaml';

interface ApiSource {
	spec: string;
	output?: string;
	title?: string;
}

interface Schema {
	$ref?: string;
	type?: string | string[];
	format?: string;
	enum?: unknown[];
	default?: unknown;
	example?: unknown;
	description?: string;
	deprecated?: boolean;
	readOnly?: boolean;
	writeOnly?: boolean;
	nullable?: boolean;
	required?: string[];
	items?: Schema;
	properties?: Record<string, Schema>;
	allOf?: Schema[];
	oneOf?: Schema[];
	anyOf?: Schema[];
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	pattern?: string;
}

interface MediaType {
	schema?: Schema;
	example?: unknown;
	examples?: Record<string, { value?: unknown }>;
}

interface Parameter {
	$ref?: string;
	name: string;
	in: string;
	required?: boolean;
	deprecated?: boolean;
	description?: string;
	schema?: Schema;
}

interface Header {
	schema?: Schema;
	description?: string;
	required?: boolean;
}

interface Body {
	$ref?: string;
	description?: string;
	content?: Record<string, MediaType>;
	headers?: Record<string, Header>;
}

type SecurityRequirement = Record<string, string[]>;

interface Operation {
	tags?: string[];
	summary?: string;
	description?: string;
	operationId?: string;
	deprecated?: boolean;
	parameters?: Parameter[];
	requestBody?: Body;
	responses?: Record<string, Body>;
	security?: SecurityRequirement[];
	servers?: { url: string }[];
}

interface PathItem {
	servers?: { url: string }[];
	parameters?: Parameter[];
	get?: Operation;
	post?: Operation;
	put?: Operation;
	patch?: Operation;
	delete?: Operation;
}

interface SecurityScheme {
	type?: string;
	name?: string;
	in?: string;
	scheme?: string;
	bearerFormat?: string;
	description?: string;
	flows?: Record<string, { scopes?: Record<string, string> }>;
	openIdConnectUrl?: string;
}

interface Spec {
	info?: { title?: string };
	servers?: { url: string }[];
	tags?: { name: string }[];
	security?: SecurityRequirement[];
	paths?: Record<string, PathItem>;
	webhooks?: Record<string, PathItem>;
	components?: {
		schemas?: Record<string, Schema>;
		securitySchemes?: Record<string, SecurityScheme>;
	};
	[key: string]: unknown;
}

const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;
const METHOD_ICON: Record<string, string> = {
	get: 'arrow-down-to-line',
	post: 'plus',
	put: 'pencil',
	patch: 'pencil',
	delete: 'trash-2'
};

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

// Escape characters Svelte would otherwise read as markup/expressions in the
// Markdown body (outside code blocks, which mdsvex already escapes).
export const escapeText = (text: string): string =>
	text.replace(/[<{}]/g, (c) => ({ '<': '&lt;', '{': '&#123;', '}': '&#125;' })[c] ?? c);

export function slugify(value: string): string {
	return value
		.replace(/\{[^}]+\}/g, (m) => m.slice(1, -1))
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
}

const refName = (ref: string): string => ref.slice(ref.lastIndexOf('/') + 1);

function resolve<T>(spec: Spec, node: T): T {
	let current: unknown = node;
	const seen = new Set<string>();
	while (isObject(current) && typeof current.$ref === 'string' && !seen.has(current.$ref)) {
		seen.add(current.$ref);
		const parts = current.$ref.replace(/^#\//, '').split('/');
		current = parts.reduce<unknown>((acc, key) => (isObject(acc) ? acc[key] : undefined), spec);
	}
	return (current ?? {}) as T;
}

// Merge `allOf` into a single object schema; keep oneOf/anyOf for labelling.
function composed(spec: Spec, schema: Schema): Schema {
	const s = resolve(spec, schema);
	if (!s.allOf) return s;
	const merged: Schema = { type: 'object', properties: {}, required: [] };
	for (const part of [...s.allOf, s]) {
		const r = resolve(spec, part);
		Object.assign(merged.properties!, r.properties);
		if (r.required) merged.required!.push(...r.required);
	}
	return merged;
}

const baseType = (type?: string | string[]): string | undefined =>
	Array.isArray(type) ? type.find((t) => t !== 'null') : type;

export function typeLabel(spec: Spec, schema?: Schema): string {
	if (!schema) return 'any';
	if (schema.$ref) return refName(schema.$ref);
	if (schema.oneOf || schema.anyOf) {
		const variants = (schema.oneOf ?? schema.anyOf)!.map((v) => typeLabel(spec, v));
		return [...new Set(variants)].join(' or ');
	}
	if (schema.enum) return 'enum';
	const type = baseType(schema.type);
	if (type === 'array') {
		const items = schema.items?.$ref ? refName(schema.items.$ref) : typeLabel(spec, schema.items);
		return `array of ${items}`;
	}
	return schema.format ?? type ?? 'object';
}

export function describe(schema: Schema): string {
	const lines: string[] = [];
	if (schema.description) lines.push(schema.description);
	const notes: string[] = [];
	if (schema.enum) notes.push(`one of ${schema.enum.map((v) => `\`${v}\``).join(', ')}`);
	if (schema.format && !schema.description?.includes(schema.format))
		notes.push(`format \`${schema.format}\``);
	if (schema.pattern) notes.push(`pattern \`${schema.pattern}\``);
	if (schema.minLength !== undefined || schema.maxLength !== undefined) {
		notes.push(`length ${schema.minLength ?? 0}–${schema.maxLength ?? '∞'}`);
	}
	if (schema.minimum !== undefined || schema.maximum !== undefined) {
		notes.push(`range ${schema.minimum ?? '−∞'}–${schema.maximum ?? '∞'}`);
	}
	if (schema.default !== undefined && typeof schema.default !== 'object') {
		notes.push(`defaults to \`${schema.default}\``);
	}
	if (schema.readOnly) notes.push('read-only');
	if (schema.writeOnly) notes.push('write-only');
	if (schema.deprecated) notes.push('deprecated');
	if (notes.length) lines.push(`(${notes.join(', ')})`);
	return lines.join(' ');
}

function attrs(spec: Spec, name: string, schema: Schema, required?: boolean): string {
	const parts = [`name="${name}"`, `type="${typeLabel(spec, schema)}"`];
	if (required) parts.push('required');
	if (schema.deprecated) parts.push('deprecated');
	if (schema.default !== undefined && typeof schema.default !== 'object') {
		parts.push(`default="${String(schema.default).replace(/"/g, '&quot;')}"`);
	}
	return parts.join(' ');
}

// Render a property list. Inline nested objects/arrays expand inline; $ref types
// link to their generated schema page.
function fields(spec: Spec, schema: Schema, group: string, component: string, depth = 0): string {
	const resolved = composed(spec, schema);
	const props = resolved.properties ?? {};
	const required = new Set(resolved.required ?? []);
	const out: string[] = [];
	for (const [name, raw] of Object.entries(props)) {
		const isRef = typeof raw.$ref === 'string';
		const prop = composed(spec, raw);
		const link = isRef ? ` typeLink="/${group}/schemas/${slugify(refName(raw.$ref!))}"` : '';
		const labelSchema = isRef ? ({ $ref: raw.$ref } as Schema) : prop;
		out.push(`<${component} ${attrs(spec, name, labelSchema, required.has(name))}${link}>`, '');
		out.push(escapeText(describe(prop)) || 'No description.', '');

		const inlineObject = !isRef && (baseType(prop.type) === 'object' || prop.properties);
		const arrayItem =
			!isRef && baseType(prop.type) === 'array' ? composed(spec, prop.items ?? {}) : null;
		if (inlineObject && depth < 3) {
			out.push(
				'<Expandable title="properties">',
				'',
				fields(spec, prop, group, component, depth + 1),
				'</Expandable>',
				''
			);
		} else if (arrayItem && arrayItem.properties && !prop.items?.$ref && depth < 3) {
			out.push(
				'<Expandable title="items">',
				'',
				fields(spec, arrayItem, group, component, depth + 1),
				'</Expandable>',
				''
			);
		}
		out.push(`</${component}>`, '');
	}
	return out.join('\n');
}

export function sample(spec: Spec, schema: Schema | undefined, depth = 0): unknown {
	const s = composed(spec, schema ?? {});
	if (depth > 5) return null;
	if (s.example !== undefined) return s.example;
	if (s.default !== undefined) return s.default;
	if (s.enum) return s.enum[0];
	if (s.oneOf || s.anyOf) return sample(spec, (s.oneOf ?? s.anyOf)![0], depth + 1);
	const type = baseType(s.type);
	if (type === 'array') return [sample(spec, s.items, depth + 1)].filter((v) => v !== null);
	if (type === 'object' || s.properties) {
		const obj: Record<string, unknown> = {};
		for (const [name, prop] of Object.entries(s.properties ?? {}))
			obj[name] = sample(spec, prop, depth + 1);
		return obj;
	}
	if (type === 'integer' || type === 'number') return 0;
	if (type === 'boolean') return true;
	if (s.format === 'date-time') return '2024-01-01T00:00:00Z';
	return type === 'string' ? 'string' : null;
}

function pickMedia(spec: Spec, body?: Body): MediaType | undefined {
	const content = resolve(spec, body ?? {}).content;
	if (!content) return undefined;
	return content['application/json'] ?? content[Object.keys(content)[0]];
}

function bodyExample(spec: Spec, media?: MediaType): unknown {
	if (!media) return undefined;
	if (media.example !== undefined) return media.example;
	const named = media.examples && Object.values(media.examples)[0];
	if (named && named.value !== undefined) return named.value;
	return media.schema ? sample(spec, media.schema) : undefined;
}

const yamlLine = (text: string): string => JSON.stringify(text.split('\n')[0]);

const SCRIPT_IMPORT =
	"\timport { Api, Endpoint, ParamField, ResponseField, RequestExample, ResponseExample, ObjectExample, Expandable } from '$lib';";

interface Page {
	tag: string;
	slug: string;
	body: string;
}

function frontmatter(title: string, description: string, method: string, icon: string): string[] {
	return [
		'---',
		`title: ${yamlLine(title)}`,
		...(description ? [`description: ${yamlLine(description)}`] : []),
		'layout: api',
		...(method ? [`method: ${method}`] : []),
		`icon: ${icon}`,
		'---',
		'',
		'<script>',
		SCRIPT_IMPORT,
		'</script>',
		''
	];
}

function describeScheme(name: string, scheme: SecurityScheme, scopes: string[]): string {
	if (scheme.type === 'http' && scheme.scheme === 'bearer') {
		return `a bearer token${scheme.bearerFormat ? ` (${scheme.bearerFormat})` : ''}`;
	}
	if (scheme.type === 'http' && scheme.scheme === 'basic') return 'HTTP basic auth';
	if (scheme.type === 'apiKey') return `an API key in the ${scheme.in} \`${scheme.name}\``;
	if (scheme.type === 'oauth2') {
		const flowScopes = Object.keys(Object.values(scheme.flows ?? {})[0]?.scopes ?? {});
		const all = scopes.length ? scopes : flowScopes;
		return `OAuth2${all.length ? ` (scopes ${all.map((s) => `\`${s}\``).join(', ')})` : ''}`;
	}
	if (scheme.type === 'openIdConnect') return 'OpenID Connect';
	return name;
}

function authLines(spec: Spec, op: Operation): string[] {
	const reqs = op.security ?? spec.security;
	if (!reqs?.length) return [];
	const schemes = spec.components?.securitySchemes ?? {};
	const alternatives = reqs
		.filter((r) => Object.keys(r).length)
		.map((r) =>
			Object.entries(r)
				.map(([n, scopes]) => (schemes[n] ? describeScheme(n, schemes[n], scopes) : n))
				.join(' and ')
		);
	if (!alternatives.length) return [];
	const optional = reqs.some((r) => Object.keys(r).length === 0);
	const text = `Requires ${alternatives.join(' or ')}.${optional ? ' Authentication is optional.' : ''}`;
	return ['## Authentication', '', escapeText(text), ''];
}

export function operationPage(
	spec: Spec,
	specBaseUrl: string,
	group: string,
	path: string,
	method: string,
	op: Operation,
	pathItem?: PathItem,
	defaultTag = 'default'
): Page {
	const tag = slugify(op.tags?.[0] ?? defaultTag);
	const title = op.summary ?? op.operationId ?? `${method.toUpperCase()} ${path}`;
	const description = op.description ?? op.summary ?? '';
	const pathExpr = path.includes('{') ? `path={'${path}'}` : `path="${path}"`;
	const baseUrl = op.servers?.[0]?.url ?? pathItem?.servers?.[0]?.url ?? specBaseUrl;

	const lines: string[] = [
		...frontmatter(title, description, method.toUpperCase(), METHOD_ICON[method] ?? 'code'),
		`# ${escapeText(title)}`,
		'',
		...(op.deprecated ? ['> This operation is deprecated.', ''] : []),
		...(description ? [escapeText(description), ''] : []),
		'<Api>',
		'',
		`<Endpoint method="${method.toUpperCase()}" ${pathExpr} baseUrl="${baseUrl}" />`,
		''
	];

	lines.push(...authLines(spec, op));

	// Path-level params are shared across operations; the operation's own win.
	const paramMap = new Map<string, Parameter>();
	for (const p of [...(pathItem?.parameters ?? []), ...(op.parameters ?? [])].map((x) =>
		resolve(spec, x)
	)) {
		paramMap.set(`${p.in}:${p.name}`, p);
	}
	const params = [...paramMap.values()];
	const groups: Record<string, string> = {
		path: 'Path parameters',
		query: 'Query parameters',
		header: 'Header parameters',
		cookie: 'Cookie parameters'
	};
	for (const where of Object.keys(groups)) {
		const list = params.filter((p) => p.in === where);
		if (!list.length) continue;
		lines.push(`## ${groups[where]}`, '');
		for (const p of list) {
			lines.push(`<ParamField ${attrs(spec, p.name, p.schema ?? {}, p.required)}>`, '');
			lines.push(
				escapeText(describe(p.schema ?? {}) || p.description || '') || 'No description.',
				''
			);
			lines.push('</ParamField>', '');
		}
	}

	const reqContent = resolve(spec, op.requestBody ?? {}).content ?? {};
	const reqTypes = Object.keys(reqContent);
	const reqKey = reqContent['application/json'] ? 'application/json' : reqTypes[0];
	const reqMedia = reqKey ? reqContent[reqKey] : undefined;
	if (reqMedia?.schema) {
		lines.push('## Body parameters', '');
		if (reqTypes.length > 1) {
			lines.push(`Accepts ${reqTypes.map((t) => `\`${t}\``).join(', ')}.`, '');
		}
		lines.push(fields(spec, reqMedia.schema, group, 'ParamField'));
	}

	const reqExample = bodyExample(spec, reqMedia);
	const curl = [
		`curl -X ${method.toUpperCase()} ${baseUrl}${path.replace(/\{([^}]+)\}/g, ':$1')}`,
		reqExample !== undefined
			? `  -H "Content-Type: ${reqKey}" \\\n  -d '${JSON.stringify(reqExample)}'`
			: ''
	]
		.filter(Boolean)
		.join(' \\\n');
	lines.push(
		'<RequestExample title="cURL">',
		'',
		'```bash',
		curl,
		'```',
		'',
		'</RequestExample>',
		''
	);

	const responses = Object.entries(op.responses ?? {}).sort(([a], [b]) => a.localeCompare(b));
	for (const [code, raw] of responses) {
		const response = resolve(spec, raw);
		const media = pickMedia(spec, response);
		lines.push(`## Response \`${code}\``, '');
		if (response.description) lines.push(escapeText(response.description), '');
		if (response.headers) {
			lines.push('Headers:', '');
			for (const [hname, hraw] of Object.entries(response.headers)) {
				const h = resolve(spec, hraw);
				const desc = h.description ? ` — ${escapeText(h.description)}` : '';
				lines.push(`- \`${hname}\` ${typeLabel(spec, h.schema)}${desc}`);
			}
			lines.push('');
		}
		if (media?.schema) lines.push(fields(spec, media.schema, group, 'ResponseField'));
		const example = bodyExample(spec, media);
		if (example !== undefined) {
			lines.push(
				`<ResponseExample title="${code}">`,
				'',
				'```json',
				JSON.stringify(example, null, 2),
				'```',
				'',
				'</ResponseExample>',
				''
			);
		}
	}

	lines.push('</Api>', '');
	return { tag, slug: slugify(op.operationId ?? `${method}-${path}`), body: lines.join('\n') };
}

export function schemaPage(spec: Spec, group: string, name: string, schema: Schema): string {
	const resolved = composed(spec, schema);
	return [
		...frontmatter(name, resolved.description ?? `The ${name} object.`, '', 'box'),
		`# ${escapeText(name)}`,
		'',
		...(resolved.description ? [escapeText(resolved.description), ''] : []),
		'<Api>',
		'',
		'## Attributes',
		'',
		fields(spec, resolved, group, 'ResponseField'),
		'<ObjectExample title={`' + name + '`}>',
		'',
		'```json',
		JSON.stringify(sample(spec, resolved), null, 2),
		'```',
		'',
		'</ObjectExample>',
		'',
		'</Api>',
		''
	].join('\n');
}

const titleCase = (value: string): string => value.replace(/(^|\s)\S/g, (c) => c.toUpperCase());

async function loadSpec(spec: string): Promise<Spec> {
	let text: string;
	if (/^https?:\/\//.test(spec)) {
		const res = await fetch(spec);
		text = await res.text();
	} else {
		text = readFileSync(spec, 'utf8');
	}
	text = text.trim();
	return (text.startsWith('{') ? JSON.parse(text) : parseYaml(text)) as Spec;
}

async function generateOne(source: ApiSource, contentRoot: string): Promise<string[]> {
	const spec = await loadSpec(source.spec);
	const baseUrl = spec.servers?.[0]?.url ?? '';
	const group = source.output || (source.title ? slugify(source.title) : 'api-reference');
	const root = join(contentRoot, group);
	rmSync(root, { recursive: true, force: true });

	const byTag = new Map<string, Page[]>();
	const collect = (entries: Record<string, PathItem> | undefined, defaultTag: string) => {
		for (const [path, item] of Object.entries(entries ?? {})) {
			for (const method of METHODS) {
				const op = item[method];
				if (!op) continue;
				const page = operationPage(spec, baseUrl, group, path, method, op, item, defaultTag);
				if (!byTag.has(page.tag)) byTag.set(page.tag, []);
				byTag.get(page.tag)!.push(page);
			}
		}
	};
	collect(spec.paths, 'default');
	collect(spec.webhooks, 'webhooks');

	const written: string[] = [];
	const write = (file: string, content: string) => {
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, content);
		written.push(file);
	};

	const tags = [...byTag.keys()];
	const schemas = Object.entries(spec.components?.schemas ?? {});
	const sections = [...tags, ...(schemas.length ? ['schemas'] : [])];
	const tagTitle = (t: string): string =>
		titleCase(spec.tags?.find((x) => slugify(x.name) === t)?.name ?? t);

	write(
		join(root, 'meta.json'),
		JSON.stringify(
			{ title: source.title ?? spec.info?.title ?? 'API Reference', icon: 'code', pages: sections },
			null,
			'\t'
		)
	);

	for (const [tag, pages] of byTag) {
		write(
			join(root, tag, 'meta.json'),
			JSON.stringify({ title: tagTitle(tag), pages: pages.map((p) => p.slug) }, null, '\t')
		);
		for (const page of pages) write(join(root, tag, `${page.slug}.md`), page.body);
	}

	if (schemas.length) {
		write(
			join(root, 'schemas', 'meta.json'),
			JSON.stringify(
				{ title: 'Schemas', icon: 'box', pages: schemas.map(([name]) => slugify(name)) },
				null,
				'\t'
			)
		);
		for (const [name, schema] of schemas) {
			write(join(root, 'schemas', `${slugify(name)}.md`), schemaPage(spec, group, name, schema));
		}
	}

	return written;
}

// Keep generated reference folders out of git (and prettier/eslint, which read
// .gitignore) without touching the rest of the file.
function ignoreGenerated(contentRoot: string, groups: string[]): void {
	const file = '.gitignore';
	const start = '# axerity:openapi (generated)';
	const end = '# end axerity:openapi';
	const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const block = [start, ...groups.map((g) => `${contentRoot}/${g}`), end].join('\n');
	let content = existsSync(file) ? readFileSync(file, 'utf8') : '';
	content = content.replace(new RegExp(`\\n*${esc(start)}[\\s\\S]*?${esc(end)}\\n*`, 'g'), '\n');
	if (groups.length) content = `${content.replace(/\n+$/, '')}\n\n${block}\n`;
	writeFileSync(file, content);
}

/**
 * Generate one or more API references (local file or URL, JSON or YAML) into the
 * content folder. An array of sources produces a separate group per spec.
 */
export async function generateApiDocs(
	openapi: string | ApiSource | ApiSource[] | undefined,
	contentRoot: string
): Promise<string[]> {
	const sources = (openapi ? (Array.isArray(openapi) ? openapi : [openapi]) : []).map((o) =>
		typeof o === 'string' ? { spec: o } : o
	);
	const written: string[] = [];
	const groups: string[] = [];
	for (const source of sources) {
		if (!source.spec) continue;
		if (!/^https?:\/\//.test(source.spec) && !existsSync(source.spec)) continue;
		groups.push(source.output || (source.title ? slugify(source.title) : 'api-reference'));
		try {
			written.push(...(await generateOne(source, contentRoot)));
		} catch (error) {
			console.warn(`[axerity] OpenAPI generation failed for ${source.spec}:`, error);
		}
	}
	// When the CLI mounts a user's project into the engine, generated pages live
	// engine-side and never touch the user's repo, so the .gitignore block is
	// pointless — and rewriting .gitignore mid-run is dangerous. Skip it then.
	if (!process.env.AXERITY_MOUNTED) ignoreGenerated(contentRoot, groups);
	return written;
}
