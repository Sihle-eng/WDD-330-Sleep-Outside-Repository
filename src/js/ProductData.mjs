// const baseURL = import.meta.env.VITE_SERVER_URL
// console.log(baseURL);

export default class ProductData {
  constructor(category) {
    this.category = category;
    // ✅ Use the public folder directly (no /src)
    this.path = `/json/${this.category}.json`;
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
   * @param {string} id - Product ID to search for.
   */
  findById(products, id) {
    return products.find(p => p.Id === id);
  }
}
