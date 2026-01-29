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
        this.services = new ExternalServices("https://wdd330-backend.onrender.com"); // use https
    }

    init() {
        // Always default to an array
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
        this.renderItems();
        this.calculateOrderTotal(); // ✅ ensure totals show immediately
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce((sum, item) => {
            const price = item.FinalPrice || item.price || 0;
            const qty = item.quantity || 1;
            return sum + price * qty;
        }, 0);

        const itemCount = this.list.length;

        const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
        const itemCountElement = document.querySelector(`${this.outputSelector} #num-items`);

        if (subtotalElement) subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
        if (itemCountElement) itemCountElement.innerText = itemCount;
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;

        const itemCount = this.list.length;
        this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotalElement = document.querySelector(`${this.outputSelector} #orderTotal`);

        if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
        if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        if (orderTotalElement) orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    renderItems() {
        const itemsContainer = document.querySelector(`${this.outputSelector} #order-items`);
        if (!itemsContainer) return;

        itemsContainer.innerHTML = "";

        this.list.forEach(item => {
            const name = item.NameWithoutBrand || item.name || "Unnamed product";
            const price = item.FinalPrice || item.price || 0;
            const qty = item.quantity || 1;

            const li = document.createElement("li");
            li.textContent = `${name} - $${price} x ${qty}`;
            itemsContainer.appendChild(li);
        });
    }

    packageItems(items) {
        return items.map(item => ({
            id: item.id || item.Id,
            name: item.NameWithoutBrand || item.name,
            price: item.FinalPrice || item.price,
            quantity: item.quantity || 1
        }));
    }

    formDataToJSON(formElement) {
        const formData = new FormData(formElement);
        const convertedData = {};
        formData.forEach((value, key) => {
            convertedData[key] = value;
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

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        };

        try {
            const response = await fetch("https://wdd330-backend.onrender.com/checkout", options);
            const json = await response.json();
            console.log("Order submitted successfully:", json);
            alert("Order submitted successfully!");
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed. Please try again.");
        }
    }
}
