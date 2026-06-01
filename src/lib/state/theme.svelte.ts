/**
 * Theme state
 *
 */
import { browser } from '$app/environment';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'axerity-theme';

function systemTheme(): ResolvedTheme {
	if (!browser) return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

class ThemeState {
	preference = $state<ThemePreference>('dark');
	#system = $state<ResolvedTheme>('light');

	resolved = $derived<ResolvedTheme>(this.preference === 'system' ? this.#system : this.preference);

	constructor() {
		if (!browser) return;

		const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			this.preference = stored;
		}
		this.#system = systemTheme();

		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		mq.addEventListener('change', (e) => {
			this.#system = e.matches ? 'dark' : 'light';
			this.#apply();
		});

		this.#apply();
	}

	#apply() {
		if (!browser) return;
		const resolved = this.preference === 'system' ? this.#system : this.preference;
		document.documentElement.classList.toggle('dark', resolved === 'dark');
	}

	set(preference: ThemePreference) {
		this.preference = preference;
		if (browser) localStorage.setItem(STORAGE_KEY, preference);
		this.#apply();
	}

	toggle() {
		this.set(this.resolved === 'dark' ? 'light' : 'dark');
	}
}

export const theme = new ThemeState();
