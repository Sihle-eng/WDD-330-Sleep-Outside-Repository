// product-listing.js - Main entry point for product listing page
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

// Main initialization function
async function initializeProductListing() {
    console.log('[ProductListing] Initializing product listing...');

    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const search = params.get('search');

    console.log('[ProductListing] URL parameters:', { category, search });

    // Get DOM elements
    const listElement = document.querySelector('.product-list');
    const heading = document.getElementById('category-heading');
    const breadcrumb = document.querySelector('.breadcrumb');

    // Validate required elements
    if (!listElement) {
        console.error('[ProductListing] Product list element (.product-list) not found');
        return;
    }

    // Show loading state
    listElement.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        // CASE 1: Search with category
        if (search && category) {
            await handleSearch(category, search, listElement, heading, breadcrumb);
        }
        // CASE 2: Category only
        else if (category) {
            await handleCategory(category, listElement, heading, breadcrumb);
        }
        // CASE 3: Search without category (invalid)
        else if (search) {
            handleSearchWithoutCategory(search, listElement, heading);
        }
        // CASE 4: No parameters - show error or redirect
        else {
            handleNoParameters(listElement, heading);
        }
    } catch (error) {
        console.error('[ProductListing] Error:', error);
        showError(listElement, heading, 'Failed to load products. Please try again later.');
    }
}

// Handle search with category
async function handleSearch(category, search, listElement, heading, breadcrumb) {
    console.log(`[ProductListing] Searching for "${search}" in category "${category}"`);

    // Update UI
    if (heading) {
        heading.textContent = `Search Results for "${search}" in ${formatCategoryName(category)}`;
    }

    if (breadcrumb) {
        updateBreadcrumb(breadcrumb, [
            { text: 'Home', href: '/index.html' },
            { text: formatCategoryName(category), href: `?category=${category}` },
            { text: `Search: "${search}"`, href: null }
        ]);
    }

    // Load and filter products
    const dataSource = new ExternalServices(category);
    const productList = new ProductList(category, dataSource, listElement);

    try {
        const allProducts = await dataSource.getData();
        const searchTerm = search.toLowerCase().trim();

        // Filter products
        const filteredProducts = allProducts.filter(product => {
            const name = (product.name || product.Name || '').toLowerCase();
            const brand = (product.brand || product.Brand?.Name || '').toLowerCase();
            const description = (product.description || product.Description || '').toLowerCase();
            const id = (product.id || product.Id || '').toString().toLowerCase();

            return name.includes(searchTerm) ||
                brand.includes(searchTerm) ||
                description.includes(searchTerm) ||
                id.includes(searchTerm);
        });

        console.log(`[ProductListing] Found ${filteredProducts.length} products matching "${search}"`);

        if (filteredProducts.length > 0) {
            productList.renderList(filteredProducts, (product) => {
                const productId = product.id || product.Id;
                return `../product_pages/index.html?product=${encodeURIComponent(productId)}`;
            });
        } else {
            showNoResults(listElement, search, category);
        }
    } catch (error) {
        console.error('[ProductListing] Search error:', error);
        throw error;
    }
}

// Handle category only
async function handleCategory(category, listElement, heading, breadcrumb) {
    console.log(`[ProductListing] Loading category: ${category}`);

    // Update UI
    if (heading) {
        heading.textContent = formatCategoryName(category);
    }

    if (breadcrumb) {
        updateBreadcrumb(breadcrumb, [
            { text: 'Home', href: '/index.html' },
            { text: formatCategoryName(category), href: null }
        ]);
    }

    // Load products for category
    const dataSource = new ExternalServices(category);
    const productList = new ProductList(category, dataSource, listElement);

    try {
        await productList.init((product) => {
            const productId = product.id || product.Id;
            return `../product_pages/index.html?product=${encodeURIComponent(productId)}`;
        });
    } catch (error) {
        console.error(`[ProductListing] Error loading category "${category}":`, error);
        throw error;
    }
}

// Handle search without category (invalid state)
function handleSearchWithoutCategory(search, listElement, heading) {
    console.warn('[ProductListing] Search query without category');

    if (heading) {
        heading.textContent = 'Search Requires Category';
    }

    listElement.innerHTML = `
        <div class="search-error">
            <h3>Category Required for Search</h3>
            <p>Please select a category from the navigation menu to search within.</p>
            <p>You searched for: <strong>"${search}"</strong></p>
            <div class="error-actions">
                <a href="/index.html" class="btn">Browse Categories</a>
                <button onclick="history.back()" class="btn btn-secondary">Go Back</button>
            </div>
        </div>
    `;
}

// Handle no parameters
function handleNoParameters(listElement, heading) {
    console.warn('[ProductListing] No category or search parameters provided');

    // Check if we're on the main product listing page or a subpage
    const currentPath = window.location.pathname;
    const isProductListingPage = currentPath.includes('product_listing') ||
        currentPath.includes('product-listing');

    if (isProductListingPage) {
        // On product listing page with no params - show help
        if (heading) {
            heading.textContent = 'Browse Products';
        }

        listElement.innerHTML = `
            <div class="no-params">
                <h3>No Category Selected</h3>
                <p>Please select a category from the navigation menu to view products.</p>
                <p>Available categories:</p>
                <ul class="category-list">
                    <li><a href="?category=tents">Tents</a></li>
                    <li><a href="?category=sleeping-bags">Sleeping Bags</a></li>
                    <li><a href="?category=backpacks">Backpacks</a></li>
                    <li><a href="?category=hiking-shoes">Hiking Shoes</a></li>
                    <!-- Add more categories as needed -->
                </ul>
                <a href="/index.html" class="btn">Back to Home</a>
            </div>
        `;
    } else {
        // Not on product listing page - likely wrong page
        console.error('[ProductListing] Not on product listing page, but product-listing.js loaded');
        showError(listElement, heading, 'Page configuration error. Please return to homepage.');
    }
}

// Helper function to format category name
function formatCategoryName(category) {
    if (!category) return 'Products';

    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Update breadcrumb navigation
function updateBreadcrumb(breadcrumbElement, items) {
    if (!breadcrumbElement || !items) return;

    const breadcrumbHtml = items.map((item, index) => {
        if (item.href) {
            return `<li><a href="${item.href}">${item.text}</a></li>`;
        } else {
            return `<li class="active">${item.text}</li>`;
        }
    }).join('');

    breadcrumbElement.innerHTML = breadcrumbHtml;
}

// Show no results message
function showNoResults(listElement, searchTerm, category) {
    listElement.innerHTML = `
        <div class="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            <h3>No Results Found</h3>
            <p>No products found for <strong>"${searchTerm}"</strong> in ${formatCategoryName(category)}.</p>
            <p>Suggestions:</p>
            <ul>
                <li>Check your spelling</li>
                <li>Try more general keywords</li>
                <li>Browse all products in <a href="?category=${category}">${formatCategoryName(category)}</a></li>
            </ul>
            <a href="?category=${category}" class="btn">View All ${formatCategoryName(category)}</a>
        </div>
    `;
}

// Show error message
function showError(listElement, heading, message = 'An error occurred') {
    if (heading) {
        heading.textContent = 'Error';
    }

    listElement.innerHTML = `
        <div class="error-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3>Unable to Load Products</h3>
            <p>${message}</p>
            <div class="error-actions">
                <button onclick="location.reload()" class="btn">Try Again</button>
                <a href="/index.html" class="btn btn-secondary">Back to Home</a>
            </div>
        </div>
    `;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ProductListing] DOM loaded, initializing...');
    initializeProductListing();
});

// Export for testing or manual initialization
export { initializeProductListing };