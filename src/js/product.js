import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || [];
  // check if product is already in cart
  const productInCart = cart.find((item) => item.id === product.id);
  if (productInCart) {
    alert("This item is already in your cart.");
    return;
  }

  cart.push(product); // add product to cart array
  setLocalStorage("so-cart", cart); // save updated cart to local storage
  alert("Product added to cart!");
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
