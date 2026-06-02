import { describe, expect, it } from 'vitest';
import { operationPage, schemaPage } from '$lib/openapi/generate';

const spec = {
	servers: [{ url: 'https://api.test/v1' }],
	components: {
		securitySchemes: {
			bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			apiKey: { type: 'apiKey', in: 'header', name: 'X-Api-Key' }
		},
		schemas: {
			Pet: {
				type: 'object',
				required: ['id'],
				properties: {
					id: { type: 'string', description: 'The id.' },
					name: { type: 'string' },
					owner: { $ref: '#/components/schemas/Owner' }
				}
			},
			Owner: { type: 'object', properties: { email: { type: 'string', format: 'email' } } }
		}
	}
};

const op = {
	operationId: 'getPet',
	tags: ['Pets'],
	summary: 'Get a pet',
	description: 'Fetch a pet by id.',
	security: [{ bearerAuth: [] }],
	parameters: [
		{
			name: 'petId',
			in: 'path',
			required: true,
			schema: { type: 'string' },
			description: 'The pet id.'
		},
		{ name: 'verbose', in: 'query', schema: { type: 'boolean' } }
	],
	responses: {
		'404': { description: 'Not found.' },
		'200': {
			description: 'A pet.',
			content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } }
		}
	}
};

describe('operationPage', () => {
	const page = operationPage(spec, spec.servers[0].url, 'pets-api', '/pets/{petId}', 'get', op);

	it('slugs and tags from operationId and the first tag', () => {
		expect(page.slug).toBe('getpet');
		expect(page.tag).toBe('pets');
	});

	it('writes api-layout frontmatter and the title', () => {
		expect(page.body).toContain('layout: api');
		expect(page.body).toContain('method: GET');
		expect(page.body).toContain('icon: arrow-down-to-line');
		expect(page.body).toContain('# Get a pet');
	});

	it('renders the endpoint with a templated path and base url', () => {
		expect(page.body).toContain(
			`<Endpoint method="GET" path={'/pets/{petId}'} baseUrl="https://api.test/v1" />`
		);
	});

	it('documents authentication from the security scheme', () => {
		expect(page.body).toContain('## Authentication');
		expect(page.body).toContain('a bearer token (JWT)');
	});

	it('groups parameters by location', () => {
		expect(page.body).toContain('## Path parameters');
		expect(page.body).toContain('<ParamField name="petId" type="string" required>');
		expect(page.body).toContain('## Query parameters');
		expect(page.body).toContain('name="verbose"');
	});

	it('expands a $ref response schema into response fields', () => {
		expect(page.body).toContain('## Response `200`');
		expect(page.body).toContain('## Response `404`');
		expect(page.body).toContain('<ResponseField name="id" type="string" required');
		expect(page.body.indexOf('## Response `200`')).toBeLessThan(
			page.body.indexOf('## Response `404`')
		);
	});

	it('renders a curl request example with path substitution', () => {
		expect(page.body).toContain('<RequestExample title="cURL">');
		expect(page.body).toContain('curl -X GET https://api.test/v1/pets/:petId');
	});

	it('wraps everything in the Api component', () => {
		expect(page.body).toContain('<Api>');
		expect(page.body.trimEnd().endsWith('</Api>')).toBe(true);
	});
});

describe('operationPage fallbacks', () => {
	it('uses a plain path attribute when there is no template', () => {
		const page = operationPage(spec, 'https://api.test/v1', 'g', '/pets', 'get', {
			operationId: 'listPets',
			responses: {}
		});
		expect(page.body).toContain('path="/pets"');
		expect(page.body).not.toContain("path={'/pets'}");
	});

	it('falls back to method and path for title, slug, and tag', () => {
		const page = operationPage(spec, 'https://api.test/v1', 'g', '/pets', 'get', { responses: {} });
		expect(page.body).toContain('# GET /pets');
		expect(page.slug).toBe('get-pets');
		expect(page.tag).toBe('default');
	});

	it('prefers the operation server, then marks deprecation', () => {
		const page = operationPage(spec, 'https://api.test/v1', 'g', '/pets', 'get', {
			operationId: 'x',
			deprecated: true,
			servers: [{ url: 'https://override.test' }],
			responses: {}
		});
		expect(page.body).toContain('baseUrl="https://override.test"');
		expect(page.body).toContain('This operation is deprecated.');
	});
});

describe('schemaPage', () => {
	const body = schemaPage(spec, 'pets-api', 'Pet', spec.components.schemas.Pet);

	it('renders an object schema as attributes and an example', () => {
		expect(body).toContain('icon: box');
		expect(body).not.toContain('method:');
		expect(body).toContain('# Pet');
		expect(body).toContain('## Attributes');
		expect(body).toContain('<ResponseField name="id" type="string" required');
		expect(body).toContain('<ObjectExample title={`Pet`}>');
	});

	it('links a $ref property to its schema page', () => {
		expect(body).toContain('typeLink="/pets-api/schemas/owner"');
	});
});
