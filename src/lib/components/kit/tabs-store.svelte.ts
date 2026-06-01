/**
 * Shared selection state for grouped tabs.
 *
 */
import { browser } from '$app/environment';

const PREFIX = 'axerity-tabs:';

class TabGroupStore {
	#values = $state<Record<string, string>>({});

	init(group: string) {
		if (!browser || this.#values[group] !== undefined) return;
		const stored = localStorage.getItem(PREFIX + group);
		if (stored !== null) this.#values[group] = stored;
	}

	get(group: string): string | undefined {
		return this.#values[group];
	}

	set(group: string, value: string) {
		this.#values[group] = value;
		if (browser) localStorage.setItem(PREFIX + group, value);
	}
}

export const tabGroups = new TabGroupStore();
