
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
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.error(`qsAll: Error querying selector "${selector}":`, error);
    return [];
  }
}

// LocalStorage helpers
export function getLocalStorage(key) {
  if (!key || typeof key !== 'string') {
    console.error('getLocalStorage: Invalid key provided:', key);
    return null;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`getLocalStorage: Error retrieving key "${key}":`, error);
    return localStorage.getItem(key);
  }
}

export function setLocalStorage(key, data) {
  if (!key || typeof key !== 'string') {
    console.error('setLocalStorage: Invalid key provided:', key);
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`setLocalStorage: Error saving to key "${key}":`, error);
    return false;
  }
}

// Event listener helper
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element || typeof callback !== 'function') return false;
  try {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback(event);
    }, { passive: false });
    element.addEventListener("click", callback);
    return true;
  } catch (error) {
    console.error(`setClick: Error adding event listeners to "${selector}":`, error);
    return false;
  }
}

// URL parameter helper
export function getParam(param) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    return value === '' ? null : value;
  } catch (error) {
    console.error(`getParam: Error getting parameter "${param}":`, error);
    return null;
  }
}

// Template rendering helpers
export function renderListWithTemplate(templateFn, parentElement, list, position = "beforeend", clear = true) {
  if (clear) parentElement.innerHTML = '';
  list.forEach(item => {
    try {
      const html = templateFn(item);
      if (typeof html === 'string') {
        parentElement.insertAdjacentHTML(position, html);
      }
    } catch (error) {
      console.error('renderListWithTemplate: Error rendering item:', item, error);
    }
  });
}

export function renderWithTemplate(template, parentElement, data, callback, clear = false) {
  if (clear) parentElement.innerHTML = '';
  const clone = template.content.cloneNode(true);
  if (callback) callback(clone, data);
  parentElement.appendChild(clone);
}

// Load external partials
export async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.text();
  } catch (error) {
    console.error(`loadTemplate: Error loading template from "${path}":`, error);
    return '';
  }
}

// Fixed header/footer loader
export async function loadHeaderFooter() {
  try {
    // Correct paths: public/partials/* is deployed as /partials/*
    const headerTemplate = await loadTemplate(`${import.meta.env.BASE_URL}partials/header.html`);
    const footerTemplate = await loadTemplate(`${import.meta.env.BASE_URL}partials/footer.html`);

    const headerElement = document.querySelector('#main-header, header, [data-header]');
    const footerElement = document.querySelector('#main-footer, footer, [data-footer]');

    if (headerElement && headerTemplate) {
      headerElement.innerHTML = headerTemplate;
      console.log('Header loaded successfully');
    } else if (headerElement) {
      console.warn('Header element found but template could not be loaded');
    }

    if (footerElement && footerTemplate) {
      footerElement.innerHTML = footerTemplate;
      console.log('Footer loaded successfully');
    } else if (footerElement) {
      console.warn('Footer element found but template could not be loaded');
    }

    initializeHeaderFooter();
    return !!(headerTemplate && footerTemplate);
  } catch (error) {
    console.error('loadHeaderFooter: Error loading header/footer:', error);
    return false;
  }
}

// Cart count updater
export function updateCartCount() {
  const cart = getLocalStorage('so-cart') || [];
  document.querySelectorAll('.cart-count, .cart_count, [data-cart-count]').forEach(el => {
    el.textContent = cart.length;
    el.classList.toggle('has-items', cart.length > 0);
  });
}

// Utility helpers
export function debounce(func, wait = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function formatPrice(price, currency = '$') {
  return (typeof price === 'number' && !isNaN(price))
    ? `${currency}${price.toFixed(2)}`
    : `${currency}0.00`;
}
