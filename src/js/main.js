// src/product_listing/main.js
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// -------------------- URL PARAMS --------------------
const params = new URLSearchParams(window.location.search);
const productId = params.get("product"); // expects ?product=123 or ?product=880RR

// Create one dataSource for use everywhere
// Adjust category if needed (e.g., "tents", "backpacks", etc.)
const dataSource = new ExternalServices("tents");

// -------------------- PRODUCT DETAILS --------------------
if (productId) {
    const productDetails = new ProductDetails(productId, dataSource);
    productDetails.init();
} else {
    console.log("No product ID in URL — showing product listing instead.");
    // You might want to initialize product listing here
    // For example: initProductListing();
}

// -------------------- CART FUNCTIONS --------------------
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
    const cartCountElement = document.querySelector(".cart_count");
    if (cartCountElement) {
        cartCountElement.textContent = cartItems.length;
    }
}

function addProductToCart(product) {
    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart.push(product);
    localStorage.setItem("so-cart", JSON.stringify(cart));
    updateCartBadge();
}

// -------------------- EVENT LISTENER --------------------
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("addToCart");

    if (button) {
        button.addEventListener("click", async (e) => {
            // Get product ID from the button's data attribute FIRST
            // This is more reliable than using URL params on listing pages
            const id = e.target.dataset.id || e.target.closest("[data-id]")?.dataset.id;

            // If no ID on button, fall back to URL param (for product detail pages)
            const finalId = id || productId;

            if (!finalId) {
                console.error("No product ID found for Add to Cart.");
                alert("Error: Product ID missing. Please select a product first.");
                return;
            }

            try {
                const product = await dataSource.findProductById(finalId);
                if (product) {
                    addProductToCart(product);
                    alert("Product added to cart!");
                } else {
                    alert("Product not found in data source.");
                }
            } catch (err) {
                console.error("Error adding product to cart:", err);
                alert("Something went wrong while adding to cart.");
            }
        });
    }
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => { window.location.href = "/src/checkout/index.html"; });
    }

    updateCartBadge();
});

// -------------------- HEADER/FOOTER --------------------
loadHeaderFooter();

