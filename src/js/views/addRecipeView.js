import View from './view.js';

class AddRecipeView extends View {
	_parentEl = $('.upload');

	#window = $('.add-recipe-window');
	#overlay = $('.overlay');
	#btnOpen = $('.nav__btn--add-recipe');
	#btnClose = $('.btn--close-modal');

	_successMessage = 'Recipe was successfully uploaded 💖';

	constructor() {
		super();
		this.#addHandlerShowWindow();
		this.#addHandlerHideWindow();
	}

	addHandlerUpload(handler) {
		this._parentEl.on('submit', e => {
			e.preventDefault();

			const dataArr = [...new FormData(this._parentEl[0])];
			const data = Object.fromEntries(dataArr);

			handler(data);
			// this._toggleWindow();
		});
	}

	#addHandlerShowWindow() {
		this.#btnOpen.on('click', this._toggleWindow.bind(this));
	}

	#addHandlerHideWindow() {
		this.#btnClose.on('click', this._toggleWindow.bind(this));
		this.#overlay.on('click', this._toggleWindow.bind(this));
	}

	_toggleWindow() {
		// this._clear();
		this.#overlay.toggleClass('hidden');
		this.#window.toggleClass('hidden');
	}

	_closeWindow() {
		// this._clear();
		this.#overlay.addClass('hidden');
		this.#window.addClass('hidden');
	}

	_getMarkup() {}
}

// Exporting Object of the Class
export default new AddRecipeView();
