class SearchView {
	_parentEl = $('.search');
	_searchEl = $('.search__field');

	// Returns search query
	getQuery() {
		return this._searchEl.val();
	}

	addHandler(handler) {
		this._parentEl.on('submit', e => {
			e.preventDefault();
			handler();
			this._clear();
		});
	}

	_clear() {
		this._searchEl.val('');
	}
}

export default new SearchView();
