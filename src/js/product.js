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