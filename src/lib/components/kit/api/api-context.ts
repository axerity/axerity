import type { Snippet } from 'svelte';

export interface ApiExampleEntry {
	id: number;
	title: string;
	kind: 'request' | 'response' | 'object';
	snippet: Snippet;
}

export interface ApiContext {
	registerExample(entry: Omit<ApiExampleEntry, 'id'>): number;
	unregisterExample(id: number): void;
}

export const API = Symbol('api');
