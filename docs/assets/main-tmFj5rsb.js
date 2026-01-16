import{r as s}from"./utils-DVcvGl7J.js";function n(e){if(e.ok)return e.json();throw new Error("Bad Response")}class c{constructor(t){this.category=t,this.path=`/json/${this.category}.json`}getData(){return fetch(this.path).then(n).then(t=>t)}async findProductById(t){return(await this.getData()).find(r=>r.Id===t)}}function o(e){return`
    <li class="product-card">
      <a href="product_pages/?product=${e.Id}">
        <img src="${e.Image}" alt="${e.Name}">
        <h2>${e.Brand.Name}</h2>
        <h3>${e.Name}</h3>
        <p class="product-card__price">$${e.FinalPrice}</p>
      </a>
    </li>
    `}class i{constructor(t,a,r){this.category=t,this.dataSource=a,this.listElement=r}async init(){const t=await this.dataSource.getData();this.renderList(t)}renderList(t){s(o,this.listElement,t)}}function d(){const t=(JSON.parse(localStorage.getItem("so-cart"))||[]).length;document.querySelector(".cart_count").textContent=t}d();const u=new c("tents"),h=document.querySelector(".product-list"),l=new i("Tents",u,h);l.init();
