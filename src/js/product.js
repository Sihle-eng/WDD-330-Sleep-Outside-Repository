import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

function updateCartBadge() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  document.querySelector('.cart_count').textContent = cartItems.length;
}

function addProductToCart(product) {
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  cart.push(product);
  localStorage.setItem("so-cart", JSON.stringify(cart));
  updateCartBadge(); // refresh badge immediately
}

// Attach listener once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("addToCart");
  if (button) {
    button.addEventListener("click", async (e) => {
      const product = await dataSource.findProductById(e.target.dataset.id);
      addProductToCart(product);
    });
  }
  updateCartBadge(); // show current count on page load
});



// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("addToCart")
//     .addEventListener("click", addToCartHandler);
// });
