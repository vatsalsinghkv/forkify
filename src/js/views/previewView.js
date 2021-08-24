// Provides common functionality to Result and Bookmark View
import icons from 'url:../../img/icons.svg';

import View from './view.js';

class PreviewView extends View {
	_parentEl = '';

	_getMarkup() {
		const { id, image, title, publisher, key } = this._data;
		// Makes active state by matching Hash ID
		const hashId = window.location?.hash.slice(1);

		return `
      <li class="preview">
        <a class="preview__link ${
					hashId === id ? 'preview__link--active' : ''
				}" href="#${id}">
          <figure class="preview__fig">
            <img src="${image}" alt="" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${title}</h4>
            <p class="preview__publisher">${publisher}</p>
            <div class="preview__user-generated ${key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
	}
}

export default new PreviewView();
