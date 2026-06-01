/** Context shared between <Tabs> and its <Tab> children. */
export interface TabsContext {
	register(title: string, icon?: string): number;
	unregister(id: number): void;
	isActive(id: number): boolean;
}

export const TABS = Symbol('tabs');
