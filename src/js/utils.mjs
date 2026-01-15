// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
} 

/**
 * Render a list of items into the DOM using a template function.
 * @param {Function} templateFn - Function that returns an HTML string for a single item.
 * @param {HTMLElement} parentElement - The DOM element to insert the list into.
 * @param {Array} list - Array of items to render.
 * @param {string} [position="afterbegin"] - Position for insertAdjacentHTML (default: "afterbegin").
 * @param {boolean} [clear=false] - Whether to clear the parentElement before rendering (default: false).
 */
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  // Clear existing content if requested
  if (clear) {
    parentElement.innerHTML = "";
  }

  // Generate HTML strings for each item
  const htmlStrings = list.map(templateFn);

  // Insert into the DOM at the specified position
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
