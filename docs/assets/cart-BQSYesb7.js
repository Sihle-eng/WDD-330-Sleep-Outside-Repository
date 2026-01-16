import{g as c}from"./utils-DVcvGl7J.js";function e(){const r=c("so-cart")||[];if(r.length===0){document.querySelector(".product-list").innerHTML="<p>Your cart is empty</p>";return}const a=r.map(t=>n(t));document.querySelector(".product-list").innerHTML=a.join("")}function n(r){return!r||!r.Image?"":`<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${r.Image}"
      alt="${r.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${r.Name}</h2>
  </a>
  <p class="cart-card__color">${r.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${r.FinalPrice}</p>
</li>`}e();
