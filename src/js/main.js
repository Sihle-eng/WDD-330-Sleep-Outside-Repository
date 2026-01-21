import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";  // fixed path
import { loadHeaderFooter } from "./utils.mjs";

const params = new URLSearchParams(window.location.search);
const productId = params.get("product"); // e.g. "880RR"

// Create one dataSource for use everywhere
const dataSource = new ProductData("tents");

// Only initialize product details if we have a valid productId
if (productId) {
    const productDetails = new ProductDetails(productId, dataSource);
    productDetails.init();
} else {
    console.info("No product ID in URL — skipping product details init.");
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
            const product = await dataSource.findProductById(e.target.dataset.id);
            addProductToCart(product);
            alert("Product added to cart!");
        });
    }
    updateCartBadge();
});

// Load header/footer partials
loadHeaderFooter();