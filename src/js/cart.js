import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".cart-list");
  const cartTotal = document.querySelector(".cart-total");

  // Empty cart
  if (cartItems.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "";
    return;
  }

  let total = 0;

  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("cart-card");

    li.innerHTML = `
      <h2>${item.Name}</h2>
      <p>Price: $${item.FinalPrice}</p>
    `;

    total += item.FinalPrice;
    cartList.appendChild(li);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

renderCartContents();

