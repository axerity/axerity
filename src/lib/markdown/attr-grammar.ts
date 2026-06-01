import type { JsonValue } from './types';

export class AttrError extends Error {}

interface EsNode {
	type: string;
	[key: string]: unknown;
}

export function evaluateExpression(node: EsNode): JsonValue {
	switch (node.type) {
		case 'Literal': {
			const value = (node as unknown as { value: unknown }).value;
			if (value instanceof RegExp) throw new AttrError('regex literals are not allowed');
			if (value === undefined) return null;
			return value as JsonValue;
		}
		case 'ArrayExpression':
			return (node as unknown as { elements: (EsNode | null)[] }).elements.map((el) => {
				if (!el) throw new AttrError('sparse arrays are not allowed');
				if (el.type === 'SpreadElement') throw new AttrError('spread is not allowed');
				return evaluateExpression(el);
			});
		case 'ObjectExpression':
			return Object.fromEntries(
				(node as unknown as { properties: EsNode[] }).properties.map((prop) => {
					const p = prop as {
						type: string;
						computed?: boolean;
						kind?: string;
						key: EsNode;
						value: EsNode;
					};
					if (p.type !== 'Property' || p.computed || (p.kind && p.kind !== 'init')) {
						throw new AttrError('only plain object properties are allowed');
					}
					const key =
						p.key.type === 'Identifier'
							? (p.key as unknown as { name: string }).name
							: p.key.type === 'Literal'
								? String((p.key as unknown as { value: unknown }).value)
								: null;
					if (key === null) throw new AttrError('unsupported object key');
					return [key, evaluateExpression(p.value)];
				})
			);
		case 'TemplateLiteral': {
			const tpl = node as unknown as { expressions: unknown[]; quasis: { value: { cooked: string } }[] };
			if (tpl.expressions.length) throw new AttrError('template interpolation is not allowed');
			return tpl.quasis.map((q) => q.value.cooked).join('');
		}
		case 'UnaryExpression': {
			const u = node as unknown as { operator: string; argument: EsNode };
			const value = evaluateExpression(u.argument);
			if (u.operator === '-' && typeof value === 'number') return -value;
			if (u.operator === '+' && typeof value === 'number') return value;
			if (u.operator === '!') return !value;
			throw new AttrError(`unary "${u.operator}" is not allowed`);
		}
		case 'Identifier': {
			const name = (node as unknown as { name: string }).name;
			if (name === 'undefined') return null;
			throw new AttrError(`identifier "${name}" is not allowed (use a literal)`);
		}
		default:
			throw new AttrError(`${node.type} is not allowed in an attribute`);
	}
}

interface MdxAttribute {
	type: string;
	name?: string;
	value?: string | null | { data?: { estree?: { body: EsNode[] } } };
}

export function resolveAttributes(attributes: MdxAttribute[], tag: string): Record<string, JsonValue> {
	const props: Record<string, JsonValue> = {};
	for (const attr of attributes) {
		if (attr.type === 'mdxJsxExpressionAttribute') {
			throw new AttrError(`<${tag}>: spread attributes are not allowed`);
		}
		if (attr.type !== 'mdxJsxAttribute' || !attr.name) continue;
		const name = attr.name;
		if (attr.value == null) {
			props[name] = true;
			continue;
		}
		if (typeof attr.value === 'string') {
			props[name] = attr.value;
			continue;
		}
		const estree = attr.value.data?.estree;
		const statement = estree?.body[0] as { type: string; expression: EsNode } | undefined;
		if (!statement || statement.type !== 'ExpressionStatement') {
			throw new AttrError(`<${tag}> attribute "${name}": unsupported expression`);
		}
		props[name] = evaluateExpression(statement.expression);
	}
	return props;
}
