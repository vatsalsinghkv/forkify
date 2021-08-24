/* 
CONTROLLER 
-> Application Logic (Events)
-> Interact with Model & Views
*/
// Architechture

import * as model from './model.js';
import { MODAL_CLOSE_TIME } from './config.js';
// Views
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable'; // For polyfillin g (non-syntax: find: arrray methods etc) except async await
import 'regenerator-runtime/runtime'; // For polyfilling async await
import addRecipeView from './views/addRecipeView.js';

// THESE CONTROL FUNCTIONS ARE HANDLER (RUN WHEN SOME EVENT OCCURS)

// When window is load (hashchanged - ID)
async function controlRecipes() {
	try {
		// If search has been made with ID
		const id = window.location?.hash.slice(1);
		if (!id) return;

		// 0. Update result view with selected hash id recipe
		resultsView.update(model.getResultsOfPage());

		// 1. Loading Spinner
		recipeView.renderSpinner();

		// 2. Load Recipe (can throw error)
		await model.loadRecipe(id); //async function

		// 3. Render Recipe
		recipeView.render(model.state.recipe);

		// 4. Update Bookmarks
		bookmarksView.update(model.state.bookmarks);
	} catch (err) {
		console.error(err);
		recipeView.renderError();
	}
}

function controlServings(servings) {
	// Update servings & quantity in the state
	model.updateServings(servings);
	// Rend er the recipe with new servings
	recipeView.update(model.state.recipe);
}

// When Search button clicked
async function controlSearchRecipes() {
	try {
		resultsView.renderSpinner();

		// 1. Get search query
		const query = searchView.getQuery();
		if (!query) throw new Error();

		// 2. Load search recipes
		await model.loadSearchResults(query); //change the state

		// 3. Render results & Pagination
		resultsView.render(model.getResultsOfPage(1));
		paginationView.render(model.state.search);
	} catch (err) {
		console.error(err);
		recipeView.renderError();
	}
}

function controlPagination(gotoPage) {
	// Render NEW results of page on Result Tab
	resultsView.render(model.getResultsOfPage(gotoPage));
	// Also Render NEW pagination
	paginationView.render(model.state.search);
}

function controlAddBookmark() {
	// 1. Add / Remove bookmark
	model.state.recipe.bookmarked
		? model.removeBookmark(model.state.recipe.id)
		: model.addBookmark(model.state.recipe);

	// 2. Render the items which are changed in Recipe View
	recipeView.update(model.state.recipe);

	// 3. Render bookmark view
	bookmarksView.render(model.state.bookmarks);
}

function controlBookmarkOnLoad() {
	// Render bookmark view
	bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
	try {
		// Show loading spinner
		addRecipeView.renderSpinner();

		// Upload recipe
		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipe);

		// Render new uploaded recipe
		recipeView.render(model.state.recipe);

		// Success message
		addRecipeView.renderSuccessMessage();

		// Render bookmark
		bookmarksView.render(model.state.bookmarks);

		// Change the hash ID in the URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		// Close the form
		setTimeout(() => addRecipeView._closeWindow(), MODAL_CLOSE_TIME * 1000);
	} catch (err) {
		console.error(err);
		addRecipeView.renderError(err.message);
	}
}

controlRecipes();

// EVENTS - Subscribers

// Init
(function () {
	bookmarksView.addHandler(controlBookmarkOnLoad);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	addRecipeView.addHandlerUpload(controlAddRecipe);
	recipeView.addHandlerBookmark(controlAddBookmark);
	searchView.addHandler(controlSearchRecipes);
	paginationView.addHandler(controlPagination);
})();

// if (module.hot) {
// 	module.hot.accept();
// }
