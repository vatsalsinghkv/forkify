/* 
MODEl
-> Buisness Logic (Main Logic)
-> State (UI Data)
-> HTTP Requests (API Data)
*/
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helper.js';

// Current state -> Hold which recipe is opened & search result data
const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		currentPage: 1,
		numPages: 1,
		resultsPerPage: RES_PER_PAGE,
	},
	bookmarks: [],
};

// RECIPE

const getRecipeObject = data => {
	const { recipe } = data.data;

	// To camelCase & Storing into the State
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		// If key exists
		...(recipe.key && { key: recipe.key }),
	};
};

const loadRecipe = async function (id) {
	try {
		// Can throw Error
		const data = await AJAX(`${API_URL}/${id}}?key=${API_KEY}`);

		// USE DATA
		state.recipe = getRecipeObject(data);

		// Bookmark Property
		state.bookmarks.some(bookmark => bookmark.id === id)
			? (state.recipe.bookmarked = true)
			: (state.recipe.bookmarked = false);
	} catch (err) {
		throw err;
	}
};

const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter(([key, value]) => key.startsWith('ingredient') && value !== '')
			.map(([_, ing]) => {
				// Took out ingredients from FormData: ingredient-1: 0.5, kg, Rice

				const ingArr = ing.split(',').map(el => el.trim());
				// const ingArr = ing.replaceAll(' ', '').split(',');

				if (ingArr.length !== 3)
					throw new Error(
						`Wrong ingredient format! Please use the correct format 🙂`
					);

				const [quality, unit, description] = ingArr;

				return {
					quality: quality ? +quality : null,
					unit,
					description,
				};
			});

		const recipe = {
			title: newRecipe.title,
			publisher: newRecipe.publisher,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			cooking_time: newRecipe.cookingTime,
			servings: newRecipe.servings,
			ingredients,
		};

		const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
		// USE DATA
		state.recipe = getRecipeObject(data);
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
};

const getNumPages = () => {
	const numResults = state.search.results.length;
	const resultsPerPage = state.search.resultsPerPage;
	return Math.ceil(numResults / resultsPerPage);
};

const loadSearchResults = async function (query) {
	try {
		// Can throw error
		const data = await AJAX(`${API_URL}?search=${query}}&key=${API_KEY}`);

		state.search.query = query;
		state.search.results = data.data.recipes.map(recipe => {
			return {
				id: recipe.id,
				title: recipe.title,
				publisher: recipe.publisher,
				image: recipe.image_url,
				...(recipe.key && { key: recipe.key }),
			};
		});

		state.search.numPages = getNumPages();
	} catch (err) {
		throw err;
	}
};

const getResultsOfPage = function (page = state.search.currentPage) {
	state.search.currentPage = page;

	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;

	return state.search.results.slice(start, end);
};

const updateServings = function (newServings) {
	state.recipe.ingredients.forEach(ing => {
		/* 
			Ration Q/S is Constant 
			So, Q/S = Q'/S'
			=>  (Q/S) S' = Q'
			=>  RATIO * S' = Q'

			where Q = Quantity, Q' = New Quantity, S = Servings & S' = New Servings
		*/

		// New Quantity
		ing.quantity = (ing.quantity / state.recipe.servings) * newServings;

		// New Servings
		state.recipe.servings = newServings;
	});
};

// BOOKMARKS

const storeBookmarks = () => {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const loadBookmarks = () => {
	const storage = localStorage.getItem('bookmarks');
	if (storage) state.bookmarks = JSON.parse(storage);
};

// For DEVS only
const clearBookmarks = function () {
	localStorage.clear('bookmarks');
};

const addBookmark = function (recipe) {
	// recipe -> Object
	state.bookmarks.push(recipe);
	// Mark current recipe as bookmark
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

	// Update bookmarks in local storage
	storeBookmarks();
};

const removeBookmark = function (id) {
	const index = state.bookmarks.findIndex(res => res.id === id);
	// Removing recipe from the Bookmarks (array)
	state.bookmarks.splice(index, 1);
	if (id === state.recipe.id) state.recipe.bookmarked = false;

	// Update bookmarks in local storage
	storeBookmarks();
};

// INIT
(function () {
	loadBookmarks();
})();

export {
	state,
	loadRecipe,
	uploadRecipe,
	loadSearchResults,
	getResultsOfPage,
	updateServings,
	addBookmark,
	removeBookmark,
};

// clearBookmarks();
