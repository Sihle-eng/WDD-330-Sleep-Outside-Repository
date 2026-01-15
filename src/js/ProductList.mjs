import { renderListWithTemplate } from "./utils.mjs";

// Template function for a single product card
function productCardTemplate(product) {
    return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="Image of ${product.Name}">
        <h2 class="card__brand">${product.Brand}</h2>
        <h3 class="card__name">${product.Name}</h3>
        <p class="product-card__price">$${product.Price}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = [];
    }

    async init() {
        const allProducts = await this.dataSource.getData();
        this.products = allProducts.filter(
            product => product.category === this.category
        );
        // Use the utility function here
        renderListWithTemplate(productCardTemplate, this.listElement, this.products, "afterbegin", true);
    }
}
