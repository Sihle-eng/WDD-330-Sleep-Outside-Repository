// Import utilities and classes
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Create a data source for tents
const dataSource = new ProductData("tents");

// Get the product ID from the query string (?product=...)
const productID = getParam("product");

// Create a ProductDetails instance and initialize it
const product = new ProductDetails(productID, dataSource);
product.init();

// -------------------- CART FUNCTIONS --------------------

