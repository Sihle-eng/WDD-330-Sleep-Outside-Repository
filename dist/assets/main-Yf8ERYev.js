import{r as a}from"./utils-DG3RzlP5.js";function n(t){if(t.ok)return t.json();throw new Error("Bad Response")}class c{constructor(e){this.category=e,this.path=`/json/${this.category}.json`}getData(){return fetch(this.path).then(n).then(e=>e)}async findProductById(e){return(await this.getData()).find(s=>s.Id===e)}}function i(t){return`
    <li class="product-card">
      <a href="product_pages/?products=${t.Id}">
        <img src="${t.Image}" alt="${t.Name}">
        <h2>${t.Brand.Name}</h2>
        <h3>${t.Name}</h3>
        <p class="product-card__price">$${t.FinalPrice}</p>
      </a>
    </li>
    `}class o{constructor(e,r,s){this.category=e,this.dataSource=r,this.listElement=s}async init(){const e=await this.dataSource.getData();this.renderList(e)}renderList(e){a(i,this.listElement,e)}}const d=new c("tents"),h=document.querySelector(".product-list"),u=new o("Tents",d,h);u.init();
