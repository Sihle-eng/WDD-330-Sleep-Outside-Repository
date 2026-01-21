// src/js/product.js

// Import utilities and classes
import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// -------------------- PRODUCT DETAILS --------------------

// Create a data source for tents
const dataSource = new ProductData("tents");

// Get the product ID from the query string (?product=...)
const productID = getParam("product");

// Create a ProductDetails instance and initialize it
const productDetails = new ProductDetails(productID, dataSource);
productDetails.init();

// -------------------- CART FUNCTIONS --------------------

// Update the cart badge count
function updateCartBadge() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const cartCountElement = document.querySelector(".cart_count");
  if (cartCountElement) {
    cartCountElement.textContent = cartItems.length;
  }
}

// Add a product to the cart and refresh the badge
function addProductToCart(product) {
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  cart.push(product);
  localStorage.setItem("so-cart", JSON.stringify(cart));
  updateCartBadge();
}

// -------------------- EVENT LISTENERS --------------------

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("addToCart");
  if (button) {
    button.addEventListener("click", async () => {
      const product = await dataSource.findProductById(productID);
      addProductToCart(product);
      alert("Product added to cart!");
    });
  }

  // Initialize cart badge on page load
  updateCartBadge();
});
loadHeaderFooter();