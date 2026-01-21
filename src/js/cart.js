import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// -------------------- RENDER CART --------------------
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const listElement = document.querySelector(".product-list");
  if (!listElement) {
    console.warn("[Cart] .product-list element not found in DOM.");
    return;
  }

  if (cartItems.length === 0) {
    listElement.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  const htmlItems = cartItems.map(cartItemTemplate).join("");
  listElement.innerHTML = htmlItems;
}

// -------------------- CART ITEM TEMPLATE --------------------
function cartItemTemplate(item) {
  if (!item) return "";

  const image = item.Image || "";
  const name = item.Name || "Unnamed Product";
  const color = item.Colors?.[0]?.ColorName || "N/A";
  const price = item.FinalPrice || "0.00";
  const quantity = item.quantity || 1;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${image}" alt="${name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${name}</h2>
      </a>
      <p class="cart-card__color">${color}</p>
      <p class="cart-card__quantity">qty: ${quantity}</p>
      <p class="cart-card__price">$${price}</p>
    </li>
  `;
}

// -------------------- ADD TO CART --------------------
function addToCart(product) {
  if (!product) {
    console.warn("[Cart] Tried to add invalid product.");
    return;
  }

  let cart = getLocalStorage("so-cart") || [];
  const existing = cart.find(item => item.Id === product.Id);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  setLocalStorage("so-cart", cart);
  renderCartContents(); // refresh cart display
}

// -------------------- INIT --------------------
renderCartContents();

export { renderCartContents, addToCart };
