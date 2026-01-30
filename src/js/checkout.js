import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";

const checkout = new CheckoutProcess("so-cart", "#orderSummary");
checkout.init();
checkout.calculateOrderTotal();

// Calculate totals after zip code entry (only if field exists)
const zipInput = document.querySelector("input[name='zip']");
if (zipInput) {
    zipInput.addEventListener("blur", () => {
        checkout.calculateOrderTotal();
    });
}

// Handle form submission safely
const form = document.getElementById("checkoutForm");
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Run built-in HTML validation
        const chk_status = form.checkValidity();
        form.reportValidity();

        if (chk_status) {
            await checkout.calculateOrderTotal();
            await checkout.checkout(form);
        }
    });
}

loadHeaderFooter();
