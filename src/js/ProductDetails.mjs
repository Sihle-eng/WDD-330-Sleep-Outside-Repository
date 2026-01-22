import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = null;
        this.dataSource = dataSource;
    }

    async init() {
        try {
            // fetch product data
            this.product = await this.dataSource.findProductById(this.productId);

            // render product details
            this.renderProductDetails();

            // safely attach event listener
            const button = document.getElementById("addToCart");
            if (button) {
                button.addEventListener("click", () => this.addProductToCart());
            } else {
                console.warn("Add to Cart button not found in DOM.");
            }
        } catch (err) {
            console.error("Error initializing product details:", err);
            document.querySelector("main").innerHTML = "<p>Unable to load product details.</p>";
        }
    }

    addProductToCart() {
        if (!this.product) {
            console.error("No product loaded to add to cart.");
            return;
        }
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
        alert("Product added to cart!");
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

// -------------------- TEMPLATE FUNCTION --------------------

function productDetailsTemplate(product) {
    if (!product) {
        console.error("Product not found for ID");
        document.querySelector("main").innerHTML = "<p>Product not found.</p>";
        return;
    }

    // Debugging
    console.log("Product object:", product);

    // Brand and name
    document.querySelector("h3").textContent = product.Brand?.Name || "Unknown Brand";
    document.querySelector("h2").textContent = product.NameWithoutBrand || "Unnamed Product";

    // Image
    const productImage = document.getElementById("productImage");
    if (productImage) {
        productImage.src = product.ImageUrl || product.Image || "";
        productImage.alt = product.NameWithoutBrand || "Product image";
    }

    // Price, color, description
    const priceEl = document.getElementById("productPrice");
    if (priceEl) priceEl.textContent = `$${product.FinalPrice}`;

    const colorEl = document.getElementById("productColor");
    if (colorEl) colorEl.textContent = product.Colors?.[0]?.ColorName || "";

    const descEl = document.getElementById("productDesc");
    if (descEl) descEl.innerHTML = product.DescriptionHtmlSimple || "";

    // Button dataset
    const button = document.getElementById("addToCart");
    if (button) button.dataset.id = product.Id;
}
