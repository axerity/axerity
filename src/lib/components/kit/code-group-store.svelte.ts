import { browser } from '$app/environment';

const KEY = 'axerity-codegroup';

class CodeGroupStore {
	#label = $state<string | undefined>(undefined);

	init() {
		if (!browser || this.#label !== undefined) return;
		const stored = localStorage.getItem(KEY);
		if (stored !== null) this.#label = stored;
	}

	get(): string | undefined {
		return this.#label;
	}

	set(label: string) {
		this.#label = label;
		if (browser) localStorage.setItem(KEY, label);
	}
}

export const codeGroups = new CodeGroupStore();
