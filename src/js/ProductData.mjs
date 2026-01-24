export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/public/json/${this.category}.json`;
    console.info(`[ProductData] Initialized with category="${category}", path="${this.path}"`);
  }

  async getData() {
    try {
      console.debug(`[ProductData] Fetching data from: ${this.path}`);
      const response = await fetch(this.path);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${this.path}: HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // If the JSON has a "Result" property, use that
      const products = Array.isArray(data) ? data : data.Result;

      if (!Array.isArray(products)) {
        throw new Error(`[ProductData] Invalid JSON format: expected an array, got ${typeof products}`);
      }

      console.debug(`[ProductData] Retrieved ${products.length} products`);
      return products;
    } catch (error) {
      console.error(`[ProductData] Error fetching data:`, error);
      return [];
    }
  }

  /**
   * Find a single product by its ID.
   * @param {Array} products - Array of product objects.
   * @param {string} id - Product ID to search for.
   * @returns {Object|null} Product object or null if not found.
   */
  findById(products, id) {
    if (!Array.isArray(products)) {
      console.error("[ProductData] findById called with invalid products array");
      return null;
    }

    // Match both Id and id fields to avoid schema mismatches
    const product = products.find(p => p.Id === id || p.id === id);

    if (!product) {
      console.warn(`[ProductData] Product not found for ID="${id}"`);
      return null;
    }

    return product;
  }
}
