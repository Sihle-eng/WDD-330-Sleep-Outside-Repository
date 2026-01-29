
import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";

const checkout = new CheckoutProcess("so-cart", "#orderSummary");
checkout.init();
checkout.calculateOrderTotal();

// Calculate totals after zip code entry
document.querySelector("input[name='zip']").addEventListener("blur", () => {
    checkout.calculateOrderTotal();
});

// Handle form submission
const form = document.getElementById("checkoutForm");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await checkout.calculateOrderTotal();
    await checkout.checkout(form);
});

loadHeaderFooter();

// you can add checkout-specific logic here later
