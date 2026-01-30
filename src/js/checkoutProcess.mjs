import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
        this.services = new ExternalServices("https://wdd330-backend.onrender.com");
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
        this.renderItems();
        this.calculateOrderTotal();
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce((sum, item) => {
            const price = item.FinalPrice ?? item.price ?? 0;
            const qty = item.quantity ?? 1;
            return sum + price * qty;
        }, 0);

        this.updateElement("#subtotal", `$${this.itemTotal.toFixed(2)}`);
        this.updateElement("#num-items", this.list.length);
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        const itemCount = this.list.length;
        this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        this.updateElement("#tax", `$${this.tax.toFixed(2)}`);
        this.updateElement("#shipping", `$${this.shipping.toFixed(2)}`);
        this.updateElement("#orderTotal", `$${this.orderTotal.toFixed(2)}`);
    }

    updateElement(selector, value) {
        const el = document.querySelector(`${this.outputSelector} ${selector}`);
        if (el) el.innerText = value;
    }

    renderItems() {
        const itemsContainer = document.querySelector(`${this.outputSelector} #order-items`);
        if (!itemsContainer) return;

        itemsContainer.innerHTML = "";
        this.list.forEach(item => {
            const name = item.NameWithoutBrand ?? item.name ?? "Unnamed product";
            const price = item.FinalPrice ?? item.price ?? 0;
            const qty = item.quantity ?? 1;

            const li = document.createElement("li");
            li.textContent = `${name} - $${price} x ${qty}`;
            itemsContainer.appendChild(li);
        });
    }

    packageItems(items) {
        return items.map(item => ({
            id: item.id ?? item.Id ?? "unknown-id",
            name: item.NameWithoutBrand ?? item.name ?? "Unnamed product",
            price: item.FinalPrice ?? item.price ?? 0,
            quantity: item.quantity ?? 1
        }));
    }

    formDataToJSON(formElement) {
        const formData = new FormData(formElement);
        const convertedData = {};
        formData.forEach((value, key) => {
            convertedData[key] = value || "";
        });
        return convertedData;
    }

    async checkout(form) {
        const orderData = this.formDataToJSON(form);
        orderData.orderDate = new Date().toISOString();
        orderData.orderTotal = this.orderTotal;
        orderData.tax = this.tax;
        orderData.shipping = this.shipping;
        orderData.items = this.packageItems(this.list);

        console.log("Sending order data:", orderData);

        try {
            const response = await fetch("https://wdd330-backend.onrender.com/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const json = await response.json();
            console.log("Order submitted successfully:", json);
            alert("Order submitted successfully!");

            localStorage.removeItem(this.key);
            window.location.href = "./success.html";
        } catch (error) {
            console.error("Checkout failed:", error.message || error);
            alert(`Checkout failed: ${error.message || "Unknown error"}`);
        }
    }
}
