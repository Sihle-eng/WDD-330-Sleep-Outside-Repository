import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }
    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSubTotal();
    }
    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce((sum, item) => sum + item.price, 0);
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
        const orderTotalElement = document.querySelector(`${this.outputSelector} #ordertotal`);

        if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
        if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        if (orderTotalElement) orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
}