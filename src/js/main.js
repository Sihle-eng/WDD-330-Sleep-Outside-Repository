import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const params = new URLSearchParams(window.location.search);
const productId = params.get("product"); // e.g. "880RR"

const dataSource = new ProductData("tents.json");
const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();

// Update the cart badge (the little number in the header)
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
    document.querySelector(".cart_count").textContent = cartItems.length;
}

// Add a product to the cart and refresh the badge
function addProductToCart(product) {
    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart.push(product);
    localStorage.setItem("so-cart", JSON.stringify(cart));
    updateCartBadge();
}

// -------------------- EVENT LISTENER --------------------

// Attach the Add to Cart button listener once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("addToCart");
    if (button) {
        button.addEventListener("click", async (e) => {
            // Get the product ID from the button's data-id attribute
            const product = await dataSource.findProductById(e.target.dataset.id);
            addProductToCart(product);
        });
    }
    // Show current cart count when the page loads
    updateCartBadge();
});
