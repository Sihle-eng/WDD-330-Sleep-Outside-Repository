import { renderListWithTemplate } from "./utils.mjs";

// -------------------- TEMPLATE FUNCTION --------------------
function productCardTemplate(product) {
    if (!product) return "";

    return `
    <li class="product-card">
      <a href="./product_pages/?product=${product.Id}">
        <img src="${product.Image || ""}" alt="${product.Name || "Product"}">
        <h2>${product.Brand?.Name || "Unknown Brand"}</h2>
        <h3>${product.Name || "Unnamed Product"}</h3>
        <p class="product-card__price">$${product.FinalPrice || "0.00"}</p>
      </a>
    </li>
  `;
}

// -------------------- PRODUCT LIST CLASS --------------------
export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        try {
            const list = await this.dataSource.getData();
            this.renderList(list);
            updateCartBadge(); // ensure badge is correct when list loads
        } catch (err) {
            console.error("[ProductList] Error initializing:", err);
            this.listElement.innerHTML = "<p>Unable to load products.</p>";
        }
    }

    renderList(list) {
        if (!Array.isArray(list) || list.length === 0) {
            this.listElement.innerHTML = "<p>No products found.</p>";
            return;
        }
        renderListWithTemplate(productCardTemplate, this.listElement, list, "beforeend");
    }
}

// -------------------- CART FUNCTIONS --------------------
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
    const count = cartItems.length;
    const badge = document.querySelector(".cart_count");
    if (badge) {
        badge.textContent = count;
    }
}

function addToCart(product) {
    if (!product) {
        console.warn("[ProductList] Tried to add invalid product to cart.");
        return;
    }
    const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart.push(product);
    localStorage.setItem("so-cart", JSON.stringify(cart));
    updateCartBadge();
}

export { addToCart, updateCartBadge };
