class SearchState {
	open = $state(false);

	toggle() {
		this.open = !this.open;
	}
}

export const searchState = new SearchState();
