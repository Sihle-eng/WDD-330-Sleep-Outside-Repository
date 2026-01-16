import{g as t}from"./utils-DG3RzlP5.js";function e(){const r=t("so-cart").map(c=>s(c));document.querySelector(".product-list").innerHTML=r.join("")}function s(a){return`<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${a.Image}"
      alt="${a.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${a.Name}</h2>
  </a>
  <p class="cart-card__color">${a.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${a.FinalPrice}</p>
</li>`} e();

function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const list = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    list.innerHTML = "<li>Your cart is empty.</li>";
    return;
  }
  list.innerHTML = cartItems.map(item => `
    <li class="cart-card divider">
      <a href="product_pages/${item.Id}.html" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
        </a>
        <a href="product_pages/${item.Id}.html">
          <h2 class="card__name">${item.Name}</h2>
          </a>
          <p class="cart-card__color">${item.Colors[0].ColorName}</p>
          <p class="cart-card__quantity">qty: ${item.Quantity}</p>
          <p class="cart-card__price">$${item.FinalPrice}</p>
          </li>
          `).join('');
}
renderCart();
