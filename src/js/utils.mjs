// ===============================
// Query Helpers
// ===============================

export function qs(selector, parent = document) {
  if (!selector || typeof selector !== 'string') {
    console.error('qs: Invalid selector:', selector);
    return null;
  }
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.error(`qs: Error querying "${selector}":`, error);
    return null;
  }
}

export function qsAll(selector, parent = document) {
  if (!selector || typeof selector !== 'string') {
    console.error('qsAll: Invalid selector:', selector);
    return [];
  }
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.error(`qsAll: Error querying "${selector}":`, error);
    return [];
  }
}

// ===============================
// LocalStorage Helpers
// ===============================

export function getLocalStorage(key) {
  if (!key || typeof key !== 'string') {
    console.error('getLocalStorage: Invalid key:', key);
    return null;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`getLocalStorage: Error parsing key "${key}":`, error);
    return localStorage.getItem(key); // fallback raw string
  }
}

export function setLocalStorage(key, data) {
  if (!key || typeof key !== 'string') {
    console.error('setLocalStorage: Invalid key:', key);
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`setLocalStorage: Error saving key "${key}":`, error);
    return false;
  }
}

// ===============================
// Event Listener Helper
// ===============================

export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element || typeof callback !== 'function') return false;

  try {
    if (!element.hasAttribute('data-click-bound')) {
      element.addEventListener("touchend", (event) => {
        event.preventDefault();
        callback(event);
      }, { passive: false });
      element.addEventListener("click", callback);
      element.setAttribute('data-click-bound', 'true');
    }
    return true;
  } catch (error) {
    console.error(`setClick: Error binding to "${selector}":`, error);
    return false;
  }
}

// ===============================
// URL Parameter Helper
// ===============================

export function getParam(param) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    return value === '' ? null : value;
  } catch (error) {
    console.error(`getParam: Error getting "${param}":`, error);
    return null;
  }
}

// ===============================
// Template Rendering Helpers
// ===============================

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

// ===============================
// External Template Loader
// ===============================

export async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.text();
  } catch (error) {
    console.error(`loadTemplate: Error loading "${path}":`, error);
    return '';
  }
}

// ===============================
// Header/Footer Loader
// ===============================

function initializeHeaderFooter() {
  updateCartCount();

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
  }

  const cartIcon = document.querySelector('.cart-icon, .cart-link');
  if (cartIcon && !cartIcon.hasAttribute('data-listener-added')) {
    cartIcon.addEventListener('click', (e) => {
      if (!cartIcon.getAttribute('href')) {
        e.preventDefault();
        window.location.href = '../cart/index.html';
      }
    });
    cartIcon.setAttribute('data-listener-added', 'true');
  }
}

export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate('/partials/header.html');
    const footerTemplate = await loadTemplate('/partials/footer.html');

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

// ===============================
// Cart Count Updater
// ===============================

export function updateCartCount() {
  const cart = getLocalStorage('so-cart') || [];
  document.querySelectorAll('.cart-count, .cart_count, [data-cart-count]').forEach(el => {
    el.textContent = String(cart.length);
    el.classList.toggle('has-items', cart.length > 0);
  });
}

// utils.mjs
export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

