import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const productListElement = document.querySelector(".product-list");

// Read category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "tents"; // default to tents if none

// Create data source and product list
const dataSource = new ProductData(category);
const productList = new ProductList(category, dataSource, productListElement);

// Render products
productList.init();
