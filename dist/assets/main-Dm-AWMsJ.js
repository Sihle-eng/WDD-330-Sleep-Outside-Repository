import{r}from"./utils-DeOcxcF7.js";import{P as c}from"./ProductData-Dx0C3TkS.js";function i(t){return`
    <li class="product-card">
      <a href="product_pages/?product=${t.Id}">
        <img src="${t.Image}" alt="Image of ${t.Name}">
        <h2 class="card__brand">${t.Brand}</h2>
        <h3 class="card__name">${t.Name}</h3>
        <p class="product-card__price">$${t.Price}</p>
      </a>
    </li>
  `}class n{constructor(s,a,e){this.category=s,this.dataSource=a,this.listElement=e,this.products=[]}async init(){const s=await this.dataSource.getData();this.products=s.filter(a=>a.category===this.category),r(i,this.listElement,this.products,"afterbegin",!0)}}async function o(){const t=new c("tents"),s=document.querySelector("#tents-list");await new n("tents",t,s).init()}o();
