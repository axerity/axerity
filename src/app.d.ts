// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Fontsource ships CSS without type declarations; declare the side-effect imports.
declare module '@fontsource-variable/geist/*';
declare module '@fontsource-variable/geist-mono/*';

export {};
