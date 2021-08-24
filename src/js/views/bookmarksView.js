import previewView from './previewView.js';
import View from './view.js';

class BookmarksView extends View {
	_parentEl = $('.bookmarks__list');
	_errorMessage = `	No bookmarks yet. Find a nice recipe and bookmark it :)`;
	_successMessage = '';

	addHandler(handler) {
		$(window).on('load', handler);
	}

	// returns li * no. of res in string
	_getMarkup() {
		return this._data
			.map(bookmark => previewView.render(bookmark, false))
			.join('');
	}
}

export default new BookmarksView();
