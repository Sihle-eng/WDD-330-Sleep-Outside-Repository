// src/js/utils.mjs

// Wrapper for querySelector with error handling
export function qs(selector, parent = document) {
  if (!selector || typeof selector !== 'string') {
    console.error('qs: Invalid selector provided:', selector);
    return null;
  }

  try {
    const element = parent.querySelector(selector);
    if (!element) {
      console.warn(`qs: Element not found with selector: "${selector}"`);
    }
    return element;
  } catch (error) {
    console.error(`qs: Error querying selector "${selector}":`, error);
    return null;
  }
}

// Wrapper for querySelectorAll with error handling
export function qsAll(selector, parent = document) {
  if (!selector || typeof selector !== 'string') {
    console.error('qsAll: Invalid selector provided:', selector);
    return [];
  }

  try {
    const elements = parent.querySelectorAll(selector);
    return elements;
  } catch (error) {
    console.error(`qsAll: Error querying selector "${selector}":`, error);
    return [];
  }
}

// Retrieve data from localStorage with error handling
export function getLocalStorage(key) {
  if (!key || typeof key !== 'string') {
    console.error('getLocalStorage: Invalid key provided:', key);
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null; // Key doesn't exist
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`getLocalStorage: Error retrieving key "${key}":`, error);

    // Try to return the raw string if JSON parsing fails
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('getLocalStorage: Could not retrieve item at all:', e);
      return null;
    }
  }
}

// Save data to localStorage with error handling
export function setLocalStorage(key, data) {
  if (!key || typeof key !== 'string') {
    console.error('setLocalStorage: Invalid key provided:', key);
    return false;
  }

  try {
    const stringData = JSON.stringify(data);
    localStorage.setItem(key, stringData);
    return true;
  } catch (error) {
    console.error(`setLocalStorage: Error saving to key "${key}":`, error);

    // Try to save as string if JSON.stringify fails
    try {
      localStorage.setItem(key, String(data));
      return true;
    } catch (e) {
      console.error('setLocalStorage: Could not save item at all:', e);
      return false;
    }
  }
}

// Set a listener for both touchend and click with error handling
export function setClick(selector, callback) {
  if (!selector || typeof selector !== 'string') {
    console.error('setClick: Invalid selector provided:', selector);
    return false;
  }

  if (typeof callback !== 'function') {
    console.error('setClick: Callback must be a function');
    return false;
  }

  const element = qs(selector);
  if (!element) {
    console.warn(`setClick: Element not found with selector: "${selector}"`);
    return false;
  }

  try {
    // Touch devices
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback(event);
    }, { passive: false });

    // Mouse click
    element.addEventListener("click", callback);

    return true;
  } catch (error) {
    console.error(`setClick: Error adding event listeners to "${selector}":`, error);
    return false;
  }
}

// Get a query parameter from the URL with error handling
export function getParam(param) {
  if (!param || typeof param !== 'string') {
    console.error('getParam: Invalid parameter name provided:', param);
    return null;
  }

  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get(param);

    // Convert empty string to null for consistency
    return value === '' ? null : value;
  } catch (error) {
    console.error(`getParam: Error getting parameter "${param}":`, error);
    return null;
  }
}

/**
 * Render a list of items into the DOM using a template function.
 * @param {Function} templateFn - Function that returns an HTML string for a single item.
 * @param {HTMLElement} parentElement - The DOM element to insert the list into.
 * @param {Array} list - Array of items to render.
 * @param {string} position - Position for insertAdjacentHTML.
 * @param {boolean} clear - Whether to clear the parent element first.
 */
export function renderListWithTemplate(templateFn, parentElement, list, position = "beforeend", clear = true) {
  // Validate inputs
  if (typeof templateFn !== 'function') {
    console.error('renderListWithTemplate: templateFn must be a function');
    return false;
  }

  if (!(parentElement instanceof HTMLElement)) {
    console.error('renderListWithTemplate: parentElement must be a DOM element');
    return false;
  }

  if (!Array.isArray(list)) {
    console.error('renderListWithTemplate: list must be an array');
    return false;
  }

  const validPositions = ['beforebegin', 'afterbegin', 'beforeend', 'afterend'];
  if (!validPositions.includes(position)) {
    console.warn(`renderListWithTemplate: Invalid position "${position}", using "beforeend"`);
    position = 'beforeend';
  }

  try {
    if (clear) {
      parentElement.innerHTML = '';
    }

    if (list.length === 0) {
      console.log('renderListWithTemplate: Empty list provided');
      return true;
    }

    list.forEach(item => {
      try {
        const html = templateFn(item);
        if (typeof html === 'string') {
          parentElement.insertAdjacentHTML(position, html);
        } else {
          console.warn('renderListWithTemplate: templateFn must return a string');
        }
      } catch (error) {
        console.error('renderListWithTemplate: Error rendering item:', item, error);
      }
    });

    return true;
  } catch (error) {
    console.error('renderListWithTemplate: Error rendering list:', error);
    return false;
  }
}

/**
 * Render a single item into the DOM using a template.
 * @param {HTMLTemplateElement} template - The <template> element to clone.
 * @param {HTMLElement} parentElement - The DOM element to insert into.
 * @param {Object} data - Data object to pass to the callback.
 * @param {Function} callback - Function to customize the clone with data.
 * @param {boolean} clear - Whether to clear the parent element first.
 */
export function renderWithTemplate(template, parentElement, data, callback, clear = false) {
  // Validate inputs
  if (!template || !(template instanceof HTMLTemplateElement)) {
    console.error('renderWithTemplate: template must be a HTMLTemplateElement');
    return false;
  }

  if (!(parentElement instanceof HTMLElement)) {
    console.error('renderWithTemplate: parentElement must be a DOM element');
    return false;
  }

  if (callback && typeof callback !== 'function') {
    console.error('renderWithTemplate: callback must be a function if provided');
    return false;
  }

  try {
    if (clear) {
      parentElement.innerHTML = '';
    }

    // Clone the template
    const clone = template.content.cloneNode(true);

    // Run the callback to customize the clone with data
    if (callback) {
      callback(clone, data);
    }

    // Append to the parent element
    parentElement.appendChild(clone);
    return true;
  } catch (error) {
    console.error('renderWithTemplate: Error rendering template:', error);
    return false;
  }
}

/**
 * Load an external HTML partial (like header or footer).
 * @param {string} path - Path to the HTML file.
 * @returns {Promise<string>} - The HTML text or empty string on error.
 */
export async function loadTemplate(path) {
  if (!path || typeof path !== 'string') {
    console.error('loadTemplate: Invalid path provided:', path);
    return '';
  }

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      console.warn(`loadTemplate: Response is not HTML for path: ${path}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`loadTemplate: Error loading template from "${path}":`, error);
    return '';
  }
}

/**
 * Load header and footer partials into the page.
 * @returns {Promise<boolean>} - Whether both header and footer were loaded.
 */
export async function loadHeaderFooter() {
  try {
    const headerPaths = [
      '../public/partials/header.html'
    ];

    const footerPaths = [
      '../public/partials/footer.html'
    ];


    let headerTemplate = '';
    let footerTemplate = '';

    // Try multiple paths for header
    for (const path of headerPaths) {
      try {
        headerTemplate = await loadTemplate(path);
        if (headerTemplate) break;
      } catch (e) {
        // Try next path
        continue;
      }
    }

    // Try multiple paths for footer
    for (const path of footerPaths) {
      try {
        footerTemplate = await loadTemplate(path);
        if (footerTemplate) break;
      } catch (e) {
        // Try next path
        continue;
      }
    }

    // Find header and footer elements
    const headerSelectors = ['#main-header', 'header', '[data-header]'];
    const footerSelectors = ['#main-footer', 'footer', '[data-footer]'];

    let headerElement = null;
    let footerElement = null;

    for (const selector of headerSelectors) {
      headerElement = document.querySelector(selector);
      if (headerElement) break;
    }

    for (const selector of footerSelectors) {
      footerElement = document.querySelector(selector);
      if (footerElement) break;
    }

    // Load header if element exists
    if (headerElement && headerTemplate) {
      headerElement.innerHTML = headerTemplate;
      console.log('Header loaded successfully');
    } else if (headerElement && !headerTemplate) {
      console.warn('Header element found but template could not be loaded');
    }

    // Load footer if element exists
    if (footerElement && footerTemplate) {
      footerElement.innerHTML = footerTemplate;
      console.log('Footer loaded successfully');
    } else if (footerElement && !footerTemplate) {
      console.warn('Footer element found but template could not be loaded');
    }

    // Initialize any interactive elements in header/footer
    initializeHeaderFooter();

    return !!(headerTemplate && footerTemplate);
  } catch (error) {
    console.error('loadHeaderFooter: Error loading header/footer:', error);
    return false;
  }
}

/**
 * Initialize interactive elements in header/footer (like cart updates)
 */
function initializeHeaderFooter() {
  // Update cart count if element exists
  updateCartCount();

  // Set up mobile menu toggle if needed
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Set up cart icon click if needed
  const cartIcon = document.querySelector('.cart-icon, .cart-link');
  if (cartIcon && !cartIcon.hasAttribute('data-listener-added')) {
    cartIcon.addEventListener('click', (e) => {
      // If it's just an icon without a link, prevent default and navigate
      if (!cartIcon.getAttribute('href')) {
        e.preventDefault();
        window.location.href = '/cart/index.html';
      }
    });
    cartIcon.setAttribute('data-listener-added', 'true');
  }
}

/**
 * Update cart count in the header
 */
export function updateCartCount() {
  try {
    const cart = getLocalStorage('so-cart') || [];
    const cartCountElements = document.querySelectorAll('.cart-count, .cart_count, [data-cart-count]');

    cartCountElements.forEach(element => {
      element.textContent = cart.length;

      // Add visual feedback if cart was recently updated
      if (cart.length > 0) {
        element.classList.add('has-items');
      } else {
        element.classList.remove('has-items');
      }
    });
  } catch (error) {
    console.warn('updateCartCount: Could not update cart count:', error);
  }
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string} - Formatted price
 */
export function formatPrice(price, currency = '$') {
  if (typeof price !== 'number' || isNaN(price)) {
    console.warn('formatPrice: Invalid price provided:', price);
    return `${currency}0.00`;
  }

  return `${currency}${price.toFixed(2)}`;
}