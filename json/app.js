var Filter={
    Elements:{
        productCenter:document.querySelector(".product-center"),
        cardOverlay:document.querySelector(".card-overlay"),
        closeCrt:document.querySelector(".close-cart"),
        cartContent:document.querySelector(".cart-content"),
        clearCart:document.querySelector(".clear-cart"),
        cart:document.querySelector(".cart"),
        total:document.querySelector(".cart-total"),
        dropDownItem:document.querySelectorAll(".ctg .dropdown-item"),
        dropDownItemSort:document.querySelectorAll(".sort .dropdown-item"),
        header:document.querySelector("header"),
        loadMore:document.querySelector(".load-more"),
        offCanvas:document.querySelector(".offcanvas"),
        sectionTitle:document.querySelector(".section-title"),
        ctgProductCenter:document.querySelector(".ctg-product-center")
        
    },
    Apis:{
        products:"https://dummyjson.com/products",
        categories:"https://dummyjson.com/products/category/"
    },
    Status:{
        categories:[],
        cards:[],
        newProduct:[],
        products:[],
        limit:30,
        skip:0,
    },
    Actions:{
        init:()=>{

            Filter.Actions.getProducts(Filter.Apis.products);
            const cardlist=JSON.parse(localStorage.getItem("cardlist"));
            if (!cardlist){
                localStorage.setItem("cardlist",JSON.stringify([]))
            }else{
                Filter.Status.cards=cardlist;
            }
        },
       
        reset:()=>{
            Filter.Actions.addToHTML(Filter.Status.products);
            Filter.Elements.header.style.display="flex";
            Filter.Elements.loadMore.style.display="flex";
            Filter.Elements.sectionTitle.innerHTML="Our Products"
            Filter.Elements.ctgProductCenter.display="none"

        },
        firstCharUpper:(x)=>{
            var text=x.replaceAll("-", " ");
            var firstChar=text.charAt(0).toLocaleUpperCase();
            text=firstChar+text.substring(1);
            return text;   
        },
        allCharLower:(x)=>{
            var text=x.replaceAll(/\s+/g, "-");
            text=text.toLowerCase();
            return text;  
        },

        loadMore:()=>{

            const skip=Filter.Status.skip+Filter.Status.limit;
            Filter.Status.skip=skip;
            limit=Filter.Status.limit;
            const url="https://dummyjson.com/products?limit="+limit+"&skip="+skip;
            Filter.Actions.getProducts(url);
        },
        showCart:()=>{
            Filter.Elements.cardOverlay.style.visibility = "visible"
            Filter.Elements.cart.style.transform = "none";
            Filter.Status.cards.forEach((item,index) => {
                    Filter.Actions.addCart(item,index)
                });
        },
        amount:(item,index)=>{
            var id=item.getAttribute("id")
            var amount=Number(item.parentElement.children[1].innerText)
            amount= (id==="add" ? amount+1: amount-1)
            item.parentElement.children[1].innerText=amount
            Filter.Status.cards[index].amount=amount;
            localStorage.setItem("cardlist",JSON.stringify(Filter.Status.cards))
            Filter.Actions.addCart(Filter.Status.cards)
            console.log("new amount "+amount )
        },
        remove:(item,index)=>{
            
            var i=item.getAttribute("data-id")
            Filter.Status.cards.splice(index,1)
            localStorage.setItem("cardlist",JSON.stringify(Filter.Status.cards))
            Filter.Actions.addCart(Filter.Status.cards,i)
        },
        clearCart:()=>{
            Filter.Status.cards=[];
            localStorage.setItem("cardlist",JSON.stringify(Filter.Status.cards))
            Filter.Actions.addCart( Filter.Status.cards)
            Filter.Actions.closeCard();
            
        },
        addCart:(array,id)=>{
            var total=0;
            
            Filter.Elements.cardOverlay.style.visibility = "visible"
            Filter.Elements.cart.style.transform = "none";
            Filter.Elements.cartContent.innerHTML="";
            Filter.Status.cards.forEach((item,index)=>{
                
                var div=`
                <div class="cart-item">
                    <img src="${item.thumbnail}" alt="product">
                    <div class="price">
                        <h4>${item.title}</h4>
                        <h5>${item.price}$</h5>
                        <span class="remove-item" data-id="${id}" onclick=Filter.Actions.remove(this,${index})>remove</span>
                    </div>
                    <div class="amount" >
                        <svg id="add" onclick=Filter.Actions.amount(this,${index}) xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                          </svg>
                        <p class="item-amount">${item.amount}</p>
                        <svg id="reduce" onclick=Filter.Actions.amount(this,${index}) xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                          </svg>
                    </div>
                </div>
            `
           
            total+=(Number(item.price)*Number(item.amount));
            Filter.Elements.cartContent.innerHTML+=div;
            })
            Filter.Elements.total.innerText=total;
           
        },
        controlCart:(item,index)=>{
           var id=item.id
           var boolean=true;
           Filter.Status.cards.forEach(x=>{
                if(x.id == item.id){
                    boolean=false;
                }
           })
           if(boolean){
            var i=Number(item.id)-1
            var product=Filter.Status.products[i];
            Filter.Status.cards.push(product);
            Filter.Status.cards.forEach(item=>{
                item.amount=1;
            })
            item.children[1].innerHTML="IN CARD";
            item.disabled=true;
            localStorage.setItem("cardlist",JSON.stringify(Filter.Status.cards))
            Filter.Actions.addCart(Filter.Status.cards,id)
           
           }else{
           
            alert("Ürün zaten sepetinizde bulunmaktadır.")
           }
           
           
        },
        ctgHtml:()=>{
            Filter.Elements.header.style.display="none";
            Filter.Elements.loadMore.style.display="none";

        },
        selectCtg:(e)=>{
            Filter.Actions.ctgHtml()
            var ctg=e.target.parentElement.innerText;
            ctg=(ctg.replaceAll(/\s+/g, "-")).toLowerCase()
            var url=Filter.Apis.categories+ctg
            Filter.Elements.sectionTitle.innerHTML=e.target.parentElement.innerText
            Filter.Actions.getCategory(url)

        },

        closeCard:()=>{
           
            Filter.Elements.cardOverlay.style.visibility = "hidden"
            Filter.Elements.cart.style.transform =" translateX(100%)"
        },

        mouseOver:(item)=>{
           
            item.children[1].style.transform="none";
            item.children[0].classList.add("transparan")
        },

        mouseOut:(item)=>{
            item.children[1].style.transform="translateX(101%)";
            item.children[0].classList.remove("transparan")
        },

        sortBy:(e)=>{
            var x=(e.target.parentElement)
            x=x.getAttribute("aria-labelledby")
            if(x==="price-low"){
                var arr=Filter.Status.products.sort(function(a,b){return a.price-b.price})
                Filter.Actions.addToHTML(arr)
            }
            else if(x=="price-high"){
                var arr=Filter.Status.products.sort(function(a,b){return b.price-a.price})
                Filter.Actions.addToHTML(arr)
            }
            else if(x=="rating"){
                var arr=Filter.Status.products.sort(function(a,b){return a.rating-b.rating})
                Filter.Actions.addToHTML(arr)
            }
            else if(x=="discount"){
                var arr=Filter.Status.products.sort(function(a,b){return b.discount-a.discount})
                Filter.Actions.addToHTML(arr)
            }
            Filter.Actions.ctgHtml()
        },

        addToHTML:(array)=>{
          
            Filter.Elements.productCenter.style.display="grid"
            Filter.Elements.productCenter.innerHTML="";
            array.forEach((item,index) => {
                var product=`
            <article class="product">
            <div class="img-container" onmouseover="Filter.Actions.mouseOver(this)"  onmouseout="Filter.Actions.mouseOut(this)" class="product-img" alt="product">
                <img id="${item.id}" src="${item.thumbnail}" >
                 <button id=${item.id} class="bag-btn" data-id="1" onclick=Filter.Actions.controlCart(this,${index})>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <span>add to card</span>
                </button>
            </div>
            <h3>${item.title}</h3>
            <h4>${item.price}$</h4>
            </article>
            `
            Filter.Elements.productCenter.innerHTML+=product;
            });
            
        },
        addToCtgHTML:(array)=>{
            console.log("addto da")
            Filter.Elements.productCenter.style.display="none";
            Filter.Elements.ctgProductCenter.innerHTML="";
                array.forEach((item,index) => {
                var product=`
                 <div class="ctg-product">
                    <div class="ctg-product-div">
                        <div class="img-div" onmouseover="Filter.Actions.mouseOver(this)"  onmouseout="Filter.Actions.mouseOut(this)">
                            <img id="${item.id}" src="${item.thumbnail}">
                            <button id=${item.id} class="bag-btn" data-id="1" onclick=Filter.Actions.controlCart(this,${index})>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                <span>add to card</span>
                            </button>
                        </div>
                        <div class="ctg-content">
                            <div class="ctg-title">${item.title}</div>
                            <div class="ctg-desc">${item.description}</div>
                            <div class="ctg-rating">${item.rating}</div>
                            <div class="ctg-discount">${item.discountPercentage}</div>
                            <div class="ctg-price">${item.price}$</div>
                        </div>
                    </div>
                </div>
             `
             Filter.Elements.ctgProductCenter.innerHTML+=product;
             });
            
        },
        
        getCategory:(url)=>{
           
            Filter.Status.categories=[];
            fetch(url)
            .then(res => res.json())
            .then(res=>{
                    Filter.Status.categories=res.products;
                    console.log("gdşslgasgad")
                    Filter.Actions.addToCtgHTML(Filter.Status.categories);
            });
        },
        getProducts:(url)=>{
           
            Filter.Status.newProduct=[]
            fetch(url)
            .then(res => res.json())
            .then(res=>{
               
                    Filter.Status.newProduct=(res.products)
                    Filter.Status.products=Filter.Status.products.concat(Filter.Status.newProduct)
                    Filter.Actions.addToHTML(Filter.Status.products);
                });
           
        }
       
    }
}
Filter.Elements.dropDownItem.forEach(item=>{
    item.addEventListener("click",Filter.Actions.selectCtg)
})
Filter.Elements.dropDownItemSort.forEach(item=>{
    item.addEventListener("click",(e)=>{
      Filter.Actions.sortBy(e);
    })
})
Filter.Actions.init()