export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/src/public/json/${this.category}.json`;
    console.info(`[ProductData] Initialized with category="${category}", path="${this.path}"`);
  }

  /**
   * Fetch all products for the given category.
   * @returns {Promise<Array>} Array of product objects.
   */
  async getData() {
    try {
      console.debug(`[ProductData] Fetching data from: ${this.path}`);
      const response = await fetch(this.path);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${this.path}: HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error(`[ProductData] Invalid JSON format: expected an array, got ${typeof data}`);
      }

      console.debug(`[ProductData] Retrieved ${data.length} products`);
      return data;
    } catch (error) {
      console.error(`[ProductData] Error fetching data:`, error);
      return []; // return empty array so app doesn’t crash
    }
  }

  /**
   * Find a single product by its ID.
   * @param {string} id - Product ID to search for.
   * @returns {Promise<Object|null>} Product object or null if not found.
   */
  async findProductById(id) {
    console.debug(`[ProductData] Searching for product with id="${id}"`);
    const products = await this.getData();

    const product = products.find(item => item.Id === id);
    if (product) {
      console.debug(`[ProductData] Product found:`, product);
      return product;
    } else {
      console.warn(`[ProductData] No product found with id="${id}"`);
      return null;
    }
  }
}
