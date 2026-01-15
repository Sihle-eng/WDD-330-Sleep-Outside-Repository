import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

async function init() {
    const dataSource = new ProductData("tents");

    const tentsElement = document.querySelector("#tents-list");
    const tentsList = new ProductList("tents", dataSource, tentsElement);

    await tentsList.init(); // fetch and render tents
}

init();
