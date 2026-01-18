// Import utilities and classes
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Create a data source for tents.json
const dataSource = new ProductData("tents.json");

// Get the product ID from the query string (?product=...)
const productID = getParam("product");

// Create a ProductDetails instance and initialize it
const product = new ProductDetails(productID, dataSource);
product.init();

// -------------------- CART FUNCTIONS --------------------
function updateCartBadge() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const badge = document.querySelector(".cart_count");
  if (badge) {
    badge.textContent = cartItems.length;
  }
}

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
