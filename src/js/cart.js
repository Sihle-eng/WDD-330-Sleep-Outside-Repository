import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty</p>";
    return;
  }
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

// function addToCart(product) {
//   let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
//   const existing = cart.find(item => item.Id === product.Id);
//   if (existing) {
//     existing.quantity = (existing.quantity || 1) + 1;
//   } else {
//     product.quantity = 1;
//     cart.push(product);
//   }
//   localStorage.setItem("so-cart", JSON.stringify(cart));
//   updateCartBadge();
// }
// addToCart();

function cartItemTemplate(item) {
  if (!item || !item.Image) {
    return ""; // Skip items that don't have required properties
  }
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

