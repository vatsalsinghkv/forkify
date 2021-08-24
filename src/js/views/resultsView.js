import previewView from './previewView.js';
import View from './view.js';

class ResultsView extends View {
	_parentEl = $('.results');
	_errorMessage = `No recipes found for your query.  Please try again!`;
	_successMessage = '';

	// returns li * no. of res in string
	_getMarkup() {
		return this._data.map(result => previewView.render(result, false)).join('');
	}
}

export default new ResultsView();
