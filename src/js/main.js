import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("product"); // e.g. "880RR"

// Initialize product details
const dataSource = new ProductData("tents.json");
const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();

// -------------------- CART BADGE --------------------
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
    const badge = document.querySelector(".cart_count");
    if (badge) {
        badge.textContent = cartItems.length;
    }
}

// Add a product to the cart and refresh the badge
async function addProductToCart(productId) {
    const product = await dataSource.findProductById(productId);
    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart.push(product);
    localStorage.setItem("so-cart", JSON.stringify(cart));
    updateCartBadge(); // update immediately
}

// -------------------- EVENT LISTENER --------------------
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("addToCart");
    if (button) {
        button.addEventListener("click", (e) => {
            addProductToCart(e.target.dataset.id);
        });
    }
    // Show current cart count when the page loads
    updateCartBadge();
});
