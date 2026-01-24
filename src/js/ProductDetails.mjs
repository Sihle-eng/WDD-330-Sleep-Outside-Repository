import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = null;
        this.dataSource = dataSource;
    }

    async init() {
        try {
            // Fetch all products for the category
            const products = await this.dataSource.getData();

            // Find product by ID (handles both Id and id fields)
            this.product = this.dataSource.findById(products, this.productId);

            if (!this.product) {
                console.warn(`[ProductDetails] Product not found for ID="${this.productId}"`);
                document.querySelector("main").innerHTML = "<p>Product not found.</p>";
                return;
            }

            // Render product details
            this.renderProductDetails();

            // Safely attach event listener
            const button = document.getElementById("addToCart");
            if (button) {
                button.addEventListener("click", () => this.addProductToCart());
            } else {
                console.warn("[ProductDetails] Add to Cart button not found in DOM.");
            }
        } catch (err) {
            console.error("[ProductDetails] Error initializing product details:", err);
            document.querySelector("main").innerHTML = "<p>Unable to load product details.</p>";
        }
    }

    addProductToCart() {
        if (!this.product) {
            console.error("[ProductDetails] No product loaded to add to cart.");
            return;
        }
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
        alert(`${this.product.NameWithoutBrand || "Product"} added to cart!`);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

// -------------------- TEMPLATE FUNCTION --------------------

function productDetailsTemplate(product) {
    if (!product) {
        console.error("[ProductDetails] Product not found for ID");
        document.querySelector("main").innerHTML = "<p>Product not found.</p>";
        return;
    }

    console.log("[ProductDetails] Rendering product:", product);

    // Brand and name
    const brandEl = document.querySelector("h3");
    if (brandEl) brandEl.textContent = product.Brand?.Name || "Unknown Brand";

    const nameEl = document.querySelector("h2");
    if (nameEl) nameEl.textContent = product.NameWithoutBrand || "Unnamed Product";

    // Image
    const productImage = document.getElementById("productImage");
    if (productImage) {
        productImage.src = product.ImageUrl || product.Image || "";
        productImage.alt = product.NameWithoutBrand || "Product image";
    }

    // Price, color, description
    const priceEl = document.getElementById("productPrice");
    if (priceEl) priceEl.textContent = product.FinalPrice ? `$${product.FinalPrice}` : "";

    const colorEl = document.getElementById("productColor");
    if (colorEl) colorEl.textContent = product.Colors?.[0]?.ColorName || "";

    const descEl = document.getElementById("productDesc");
    if (descEl) descEl.innerHTML = product.DescriptionHtmlSimple || "";

    // Button dataset
    const button = document.getElementById("addToCart");
    if (button) button.dataset.id = product.Id || product.id;
}
