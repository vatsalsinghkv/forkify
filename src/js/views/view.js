/* 
Parent Class: Contains method and data which is common to all the views.
All these methods will extended by sub View Classes.
'this' refer to calling objects (sub classes)
*/

import icons from 'url:../../img/icons.svg';

class View {
	_data;

	/**
	 *
	 * @param {Object | Object[]} data
	 * @param {[boolean=true]} render
	 * @description It renders the data (recipe mostly) in the view
	 * @author Vatsal Singh
	 */

	render(data, render = true) {
		// (Array.isArray(data) && !data.length)
		if (!data || (Array.isArray(data) && !data.length))
			return this.renderError();

		this._data = data;
		const markup = this._getMarkup();

		if (!render) return markup;

		this._clear();
		// _getMarkup is unique in each view (this -> sub class / obj)
		this._parentEl.append(markup);
	}

	// UPDATE THE ELEMENTS WHICH ARE CHANGED (STATE)
	update(data) {
		this._data = data;
		// Getting markup again it'll be diff as state is changed by handler fn
		const newMarkup = this._getMarkup();
		const newDOM = document.createRange().createContextualFragment(newMarkup);

		// $.parseHTML() Parses a string into an array of DOM nodes.
		// const newDOM = $($.parseHTML(newMarkup));
		// const newElements = Array.from(newDOM.find('*'));

		const newElements = Array.from(newDOM.querySelectorAll('*'));
		// find('*') returns all the children in all level; chilred('.class') work on one level only
		const curElements = Array.from(this._parentEl.find('*'));

		newElements.forEach((newEl, i) => {
			const curEl = curElements[i]; //HTMLElementNode .nodeValue -> Null

			if (!curEl.isEqualNode(newEl)) {
				// $(curEl).html($(newEl).html()); // not efficient we need to change text & attr only
				$(curEl).html($(newEl).html());
			}

			// If content of curDOM isnt same as newDOM
			// Changing text value
			/* if (
				!curEl.isEqualNode(newEl) &&
				curEl.firstChild?.nodeValue.trim() !== ''
			) {
				// .nodeValue: textNode -> Text, attrNode -> Attr, otherNodes -> Null
				$(curEl).text($(newEl).text());
			}

			// Changing Attributes
			if (!curEl.isEqualNode(newEl)) {
				newEl.attributes.forEach(attr => $(curEl).attr(attr.name, attr.value));
			} */
		});
	}

	renderSpinner() {
		this._clear();
		this._parentEl.append(this._getSpinnerMarkup());
	}

	// If error occurs
	renderError(message = this._errorMessage) {
		this._clear();
		this._parentEl.append(this._getErrorMarkup(message));
	}

	// If no error occurs
	renderSuccessMessage() {
		this._clear();
		this._parentEl.append(this._getSuccessMessageMarkup(this._successMessage));
	}

	_clear() {
		this._parentEl.html('');
	}

	// MARKUPS
	_getSpinnerMarkup() {
		return `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
	}

	_getErrorMarkup(message) {
		return this._getMessageMarkup('error', message);
	}

	_getSuccessMessageMarkup(message) {
		return this._getMessageMarkup('message', message);
	}

	_getMessageMarkup(type, message) {
		return `
      <div class="${type}">
        <div>
          <svg>
            <use href="${icons}#icon-${
			type === 'error' ? 'alert' : 'smile'
		}-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
	}
}

export default View;
