import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
	_parentEl = $('.pagination');

	addHandler(handler) {
		this._parentEl.on('click', e => {
			const btn = e.target.closest('.btn--inline');
			if (!btn) return;

			const gotoPage = +$(btn).attr('data-goto');
			handler(gotoPage);
		});
	}

	_getMarkup() {
		const numPages = this._data.numPages;
		const curPage = this._data.currentPage;

		// Page 1 & No other pages aren't there
		if (curPage === 1 && numPages === 1) {
			return '';
		}

		// Page 1 & Other pages are there
		else if (curPage === 1 && numPages >= 1) {
			return this.#getNextBtnMarkup(curPage);
		}

		// Page in between
		else if (curPage < numPages) {
			return `
				${this.#getPrevBtnMarkup(curPage)}
				${this.#getNextBtnMarkup(curPage)}
			`;
		}

		// Last Page
		else if (curPage === numPages) {
			return this.#getPrevBtnMarkup(curPage);
		}
	}

	#getPrevBtnMarkup(curPage) {
		return `
			<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
				<svg class="search__icon">
					<use href="${icons}#icon-arrow-left"></use>
				</svg>
				<span>Page ${curPage - 1}</span>
			</button>
		`;
	}

	#getNextBtnMarkup(curPage) {
		return `
			<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
				<span>Page ${curPage + 1}</span>
				<svg class="search__icon">
					<use href="${icons}#icon-arrow-right"></use>
				</svg>
			</button>
		`;
	}
}

// Exporting Object of the Class
export default new PaginationView();
