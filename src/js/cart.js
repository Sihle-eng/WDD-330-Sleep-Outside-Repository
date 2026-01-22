// cart.js - Shopping Cart Module
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// -------------------- CART STATE MANAGEMENT --------------------
const CART_KEY = "so-cart";

class CartManager {
  constructor() {
    this.cart = this.loadCart();
  }

  loadCart() {
    try {
      const cartData = getLocalStorage(CART_KEY);
      return Array.isArray(cartData) ? cartData : [];
    } catch (error) {
      console.error("[Cart] Error loading cart from storage:", error);
      return [];
    }
  }

  saveCart() {
    try {
      setLocalStorage(CART_KEY, this.cart);
    } catch (error) {
      console.error("[Cart] Error saving cart to storage:", error);
    }
  }

  getCart() {
    return [...this.cart]; // Return a copy to prevent direct mutation
  }

  getTotalItems() {
    return this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  getTotalPrice() {
    return this.cart.reduce((total, item) => {
      const price = parseFloat(item.FinalPrice || item.price || 0);
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  }

  findItemById(productId) {
    return this.cart.find(item => {
      const itemId = item.Id || item.id || item.productId;
      return itemId === productId;
    });
  }

  addItem(product, quantity = 1) {
    if (!product || !this.isValidProduct(product)) {
      console.warn("[Cart] Cannot add invalid product to cart");
      return false;
    }

    const productId = product.Id || product.id || product.productId;
    const existingItem = this.findItemById(productId);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
      this.cart.push({
        ...product,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    this.notifyCartUpdate();
    return true;
  }

  removeItem(productId, removeAll = false) {
    const index = this.cart.findIndex(item => {
      const itemId = item.Id || item.id || item.productId;
      return itemId === productId;
    });

    if (index === -1) return false;

    if (removeAll || !this.cart[index].quantity || this.cart[index].quantity <= 1) {
      this.cart.splice(index, 1);
    } else {
      this.cart[index].quantity -= 1;
    }

    this.saveCart();
    this.notifyCartUpdate();
    return true;
  }

  removeAllItems(productId) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => {
      const itemId = item.Id || item.id || item.productId;
      return itemId !== productId;
    });

    if (this.cart.length !== initialLength) {
      this.saveCart();
      this.notifyCartUpdate();
      return true;
    }
    return false;
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.notifyCartUpdate();
  }

  isValidProduct(product) {
    const hasId = product.Id || product.id || product.productId;
    const hasName = product.Name || product.name;
    const hasPrice = product.FinalPrice || product.price;
    return !!(hasId && hasName && hasPrice !== undefined);
  }

  notifyCartUpdate() {
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: {
        cart: this.getCart(),
        totalItems: this.getTotalItems(),
        totalPrice: this.getTotalPrice()
      }
    }));

    // Update cart badge if exists
    this.updateCartBadge();
  }

  updateCartBadge() {
    const totalItems = this.getTotalItems();
    const badges = document.querySelectorAll(".cart-count, .cart_count, .cart-badge");

    badges.forEach(badge => {
      badge.textContent = totalItems;
      badge.classList.toggle("has-items", totalItems > 0);
      badge.classList.toggle("empty", totalItems === 0);

      // Add animation for visual feedback
      if (totalItems > 0) {
        badge.classList.add("updated");
        setTimeout(() => badge.classList.remove("updated"), 300);
      }
    });
  }
}

// Create singleton cart manager
const cartManager = new CartManager();

// -------------------- CART ITEM TEMPLATE --------------------
function cartItemTemplate(item, index) {
  if (!item) return "";

  const id = item.Id || item.id || item.productId || `item-${index}`;
  const name = item.Name || item.name || "Unnamed Product";
  const brand = item.Brand?.Name || item.Brand || item.brand || "Unknown Brand";
  const color = item.Colors?.[0]?.ColorName || item.color || item.Color || "N/A";
  const price = parseFloat(item.FinalPrice || item.price || 0);
  const listPrice = parseFloat(item.ListPrice || item.listPrice || 0);
  const quantity = item.quantity || 1;
  const image = item.Image || item.Images?.PrimaryLarge || item.image || item.thumbnail || "";

  const subtotal = price * quantity;
  const hasDiscount = listPrice > price;

  return `
    <li class="cart-card divider" data-id="${id}" data-index="${index}">
      <div class="cart-card__image">
        <img 
          src="${image}" 
          alt="${name}" 
          loading="lazy"
          onerror="this.src='../images/placeholder.jpg'"
        />
      </div>
      
      <div class="cart-card__content">
        <div class="cart-card__header">
          <h2 class="cart-card__name">
            <a href="../product_pages/index.html?product=${encodeURIComponent(id)}">${name}</a>
          </h2>
          <button class="cart-card__remove" data-id="${id}" aria-label="Remove ${name} from cart">
            &times;
          </button>
        </div>
        
        <p class="cart-card__brand">${brand}</p>
        ${color !== "N/A" ? `<p class="cart-card__color">Color: ${color}</p>` : ""}
        
        <div class="cart-card__quantity-controls">
          <button class="quantity-btn minus" data-id="${id}" aria-label="Decrease quantity">−</button>
          <input 
            type="number" 
            class="cart-card__quantity-input" 
            data-id="${id}" 
            value="${quantity}" 
            min="1" 
            max="99"
            aria-label="Quantity of ${name}"
          >
          <button class="quantity-btn plus" data-id="${id}" aria-label="Increase quantity">+</button>
        </div>
        
        <div class="cart-card__pricing">
          <div class="cart-card__price-per-unit">
            <span class="price">$${price.toFixed(2)}</span> each
            ${hasDiscount ? `<span class="list-price">$${listPrice.toFixed(2)}</span>` : ""}
          </div>
          <div class="cart-card__subtotal">
            Subtotal: <span class="subtotal-amount">$${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </li>
  `;
}

// -------------------- CART SUMMARY TEMPLATE --------------------
function cartSummaryTemplate(totalItems, subtotal, taxRate = 0.08) {
  const tax = subtotal * taxRate;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return `
    <div class="cart-summary">
      <h3 class="summary-title">Order Summary</h3>
      
      <div class="summary-row">
        <span>Items (${totalItems}):</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      
      <div class="summary-row">
        <span>Shipping:</span>
        <span>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
      </div>
      
      <div class="summary-row">
        <span>Estimated Tax:</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      
      <div class="summary-row total">
        <span>Order Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      
      <div class="summary-actions">
        <button class="btn btn-continue" onclick="window.location.href='../index.html'">
          Continue Shopping
        </button>
        <button class="btn btn-checkout" ${totalItems === 0 ? 'disabled' : ''}>
          Proceed to Checkout
        </button>
      </div>
      
      ${subtotal < 50 ? `
        <div class="free-shipping-note">
          <span class="shipping-icon">🚚</span>
          Add $${(50 - subtotal).toFixed(2)} more to get free shipping!
        </div>
      ` : `
        <div class="free-shipping-note achieved">
          <span class="shipping-icon">🎉</span>
          You've earned free shipping!
        </div>
      `}
    </div>
  `;
}

// -------------------- RENDER CART --------------------
function renderCartContents() {
  const cartItems = cartManager.getCart();
  const totalItems = cartManager.getTotalItems();
  const subtotal = cartManager.getTotalPrice();

  const listElement = document.querySelector(".product-list");
  const summaryElement = document.querySelector(".cart-summary") ||
    document.querySelector(".cart-footer") ||
    document.querySelector("#cart-summary") ||
    document.createElement("div");

  if (!listElement) {
    console.warn("[Cart] .product-list element not found in DOM.");
    return;
  }

  // Add summary class if it's a newly created element
  if (!summaryElement.classList.contains("cart-summary")) {
    summaryElement.className = "cart-summary";
  }

  // Clear loading state
  listElement.innerHTML = '';

  if (totalItems === 0) {
    listElement.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart__icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button class="btn btn-shopping" onclick="window.location.href='../index.html'">
          Start Shopping
        </button>
      </div>
    `;

    // Clear summary
    if (summaryElement) {
      summaryElement.innerHTML = '';
    }
    return;
  }

  // Render cart items
  const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index)).join("");
  listElement.innerHTML = htmlItems;

  // Render cart summary
  if (summaryElement) {
    summaryElement.innerHTML = cartSummaryTemplate(totalItems, subtotal);

    // Add checkout event listener
    const checkoutBtn = summaryElement.querySelector(".btn-checkout");
    if (checkoutBtn && totalItems > 0) {
      checkoutBtn.addEventListener("click", handleCheckout);
    }
  }

  // Attach event listeners to cart items
  attachCartEventListeners();
}

// -------------------- EVENT HANDLERS --------------------
function attachCartEventListeners() {
  const listElement = document.querySelector(".product-list");
  if (!listElement) return;

  // Remove single item
  listElement.addEventListener("click", (e) => {
    if (e.target.closest(".cart-card__remove")) {
      const button = e.target.closest(".cart-card__remove");
      const productId = button.dataset.id;

      if (productId) {
        if (confirm("Remove this item from cart?")) {
          cartManager.removeAllItems(productId);
          renderCartContents();
        }
      }
    }

    // Quantity decrease
    if (e.target.classList.contains("minus")) {
      const productId = e.target.dataset.id;
      cartManager.removeItem(productId, false);
      renderCartContents();
    }

    // Quantity increase
    if (e.target.classList.contains("plus")) {
      const productId = e.target.dataset.id;
      const item = cartManager.findItemById(productId);
      if (item) {
        cartManager.addItem(item, 1);
        renderCartContents();
      }
    }
  });

  // Quantity input change
  listElement.addEventListener("change", (e) => {
    if (e.target.classList.contains("cart-card__quantity-input")) {
      const productId = e.target.dataset.id;
      const newQuantity = parseInt(e.target.value);

      if (newQuantity < 1 || isNaN(newQuantity)) {
        e.target.value = 1;
        return;
      }

      const item = cartManager.findItemById(productId);
      if (item) {
        // Remove all, then add new quantity
        cartManager.removeAllItems(productId);
        cartManager.addItem(item, newQuantity);
        renderCartContents();
      }
    }
  });

  // Quantity input validation
  listElement.addEventListener("input", (e) => {
    if (e.target.classList.contains("cart-card__quantity-input")) {
      const value = parseInt(e.target.value);
      if (value < 1) e.target.value = 1;
      if (value > 99) e.target.value = 99;
    }
  });
}

function handleCheckout() {
  const cartItems = cartManager.getCart();
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // In a real app, this would redirect to checkout page
  // For now, just show confirmation
  alert(`Proceeding to checkout with ${cartManager.getTotalItems()} items.\nTotal: $${cartManager.getTotalPrice().toFixed(2)}`);

  // Optionally clear cart after checkout
  // cartManager.clearCart();
  // renderCartContents();
}

// -------------------- ADD TO CART FUNCTION --------------------
function addToCart(product, quantity = 1) {
  const success = cartManager.addItem(product, quantity);

  if (success) {
    // Show notification
    showNotification(`Added ${product.Name || product.name} to cart`, "success");
  }

  return success;
}

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification__icon">${type === "success" ? "✓" : "!"}</span>
    <span class="notification__message">${message}</span>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Remove after delay
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// -------------------- INITIALIZATION --------------------
// Initialize cart display when DOM is ready
function initCart() {
  renderCartContents();

  // Update cart badge
  cartManager.updateCartBadge();

  // Listen for cart updates from other pages/components
  window.addEventListener('cartUpdated', () => {
    renderCartContents();
  });
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCart);
} else {
  initCart();
}

// -------------------- EXPORTS --------------------
export {
  renderCartContents,
  addToCart,
  cartManager,
  initCart
};