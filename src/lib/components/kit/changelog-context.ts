/** Context shared between <Changelog> and its <Update> children. */
export interface ChangelogContext {
	register(tags: string[]): number;
	unregister(id: number): void;
	isVisible(tags: string[]): boolean;
}

export const CHANGELOG = Symbol('changelog');
