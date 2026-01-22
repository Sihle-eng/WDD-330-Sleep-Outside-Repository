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

// get a query parameter from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

/**
 * Render a list of items into the DOM using a template function.
 * @param {Function} templateFn - Function that returns an HTML string for a single item.
 * @param {HTMLElement} parentElement - The DOM element to insert the list into.
 * @param {Array} list - Array of items to render.
 * @param {string} [position="afterbegin"] - Position for insertAdjacentHTML (default: "afterbegin").
 */
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin") {
  parentElement.innerHTML = ""; // clear any existing content
  list.forEach(item => {
    parentElement.insertAdjacentHTML(position, templateFn(item));
  });
}

/**
 * Render a single item into the DOM using a template.
 * @param {HTMLTemplateElement} template - The <template> element to clone.
 * @param {HTMLElement} parentElement - The DOM element to insert into.
 * @param {Object} data - Data object to pass to the callback.
 * @param {Function} callback - Function to customize the clone with data.
 */
export function renderWithTemplate(template, parentElement, data, callback) {
  // clone the template
  const clone = template.content.cloneNode(true);

  // run the callback to customize the clone with data
  if (callback) {
    callback(clone, data);
  }

  // append to the parent element
  parentElement.appendChild(clone);
}

/**
 * Load an external HTML partial (like header or footer).
 * @param {string} path - Path to the HTML file.
 * @returns {Promise<string>} - The HTML text.
 */
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

/**
 * Load header and footer partials into the page.
 */
export async function loadHeaderFooter() {
  const header = document.querySelector("#main-header");
  const footer = document.querySelector("#main-footer");

  header.innerHTML = await loadTemplate("/public/partials/header.html");
  footer.innerHTML = await loadTemplate("/public/partials/footer.html");
}
