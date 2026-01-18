// Import utilities and classes
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Create a data source for tents
const dataSource = new ProductData("tents");

// Get the product ID from the query string (?product=...)
const productID = getParam("product");

// Create a ProductDetails instance and initialize it
const product = new ProductDetails(productID, dataSource);
product.init();

// -------------------- CART FUNCTIONS --------------------

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

// Add event listener for Add to Cart button
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("addToCart");
  if (button) {
    button.addEventListener("click", async (e) => {
      const product = await dataSource.findProductById(productID);
      addProductToCart(product);
      alert("Product added to cart!");
    });
  }

  updateCartBadge();
});