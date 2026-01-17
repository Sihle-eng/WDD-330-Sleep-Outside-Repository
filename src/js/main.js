import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const params = new URLSearchParams(window.location.search);
const productId = params.get("product"); // e.g. "880RR"

const dataSource = new ProductData("tents.json");
const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();


function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("so-cart")) || []; const count = cartItems.length; const badge = document.querySelector(".cart_count"); if (badge) { badge.textContent = count; }
}
// run once when the DOM is ready document.addEventListener("DOMContentLoaded", updateCartBadge);

updateCartBadge();