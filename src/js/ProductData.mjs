export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/src/public/json/${this.category}.json`;
    console.log(`[ProductData] Constructor: category=${category}, path=${this.path}`);
  }

  async getData() {
    console.log(`[ProductData] Fetching from: ${this.path}`);
    try {
      const response = await fetch(this.path);
      console.log(`[ProductData] Response status: ${response.status}`);
      console.log(`[ProductData] Response URL: ${response.url}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[ProductData] Data received:`, data);
      return data;
    } catch (error) {
      console.error(`[ProductData] Fetch error:`, error);
      throw error;
    }
  }

  async findProductById(id) {
    console.log(`[ProductData] findProductById called with id: "${id}"`);
    const products = await this.getData();
    console.log(`[ProductData] Total products: ${products.length}`);

    const product = products.find((item) => item.Id === id);
    console.log(`[ProductData] Found product:`, product);

    return product;
  }
}