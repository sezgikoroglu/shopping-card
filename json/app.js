var Filter={
    Elements:{
        productCenter:document.querySelector(".product-center"),
        cardOverlay:document.querySelector(".card-overlay"),
        closeCrt:document.querySelector(".close-cart"),
        cartContent:document.querySelector(".cart-content"),
        //cartItem:document.querySelector(".cart-item"),
        cart:document.querySelector(".cart"),

    },
    Apis:{
        products:"https://dummyjson.com/products",
    },
    Status:{
        local:[],
        cards:[],
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
                Filter.Status.cards.forEach((item,index) => {
                    Filter.Actions.addCart(item,index)
                   
                });
            }
        },

        loadMore:()=>{

            const skip=Filter.Status.skip+Filter.Status.limit;
            Filter.Status.skip=skip;
            limit=Filter.Status.limit;
            const url="https://dummyjson.com/products?limit="+limit+"&skip="+skip;
            Filter.Actions.getProducts(url);
        },

        addAmount:(item)=>{
           
            var amount=Number(item.parentElement.children[1].innerText);
            amount=(amount+1).toString();
            item.parentElement.children[1].innerText=amount;
            
        },

        reduceAmount:(item)=>{
            var amount=Number(item.parentElement.children[1].innerText);
            amount=(amount-1).toString();
            if (amount>=1){
            item.parentElement.children[1].innerText=amount};
        },

        remove:(item,index)=>{
            
            Filter.Status.cards.splice(index,1)
            localStorage.setItem("cardlist",JSON.stringify(Filter.Status.cards))
            Filter.Elements.cartContent.innerHTML="";
            Filter.Status.cards.forEach((item,index) => {
                Filter.Actions.addCart(item,index)
           })

        },

        addCart:(item,index)=>{
            
           
            Filter.Elements.cardOverlay.style.visibility = "visible"
            Filter.Elements.cart.style.transform = "none";
            
            var div=`
            
                <div class="cart-item">
                    <img src="${item.thumbnail}" alt="product">
                    <div class="price">
                        <h4>${item.title}</h4>
                        <h5>${item.price}$</h5>
                        <span class="remove-item" data-id="2" onclick=Filter.Actions.remove(this,${index})>remove</span>
                    </div>
                    <div class="amount" >
                        <svg onclick=Filter.Actions.addAmount(this) xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                          </svg>
                        <p class="item-amount">1</p>
                        <svg onclick=Filter.Actions.reduceAmount(this) xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                          </svg>
                    </div>
                </div>

            `
            Filter.Elements.cartContent.innerHTML+=div;
        },
        controlCart:(item,index)=>{
            
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
            
            var cardlist=Filter.Status.cards;
            localStorage.setItem("cardlist",JSON.stringify(cardlist))
            Filter.Elements.cartContent.innerHTML="";
            Filter.Status.cards.forEach((item,index) => {
                Filter.Actions.addCart(item,index)
           })

           }else{
            alert("Ürün zaten sepetinizde bulunmaktadır.")
           }
           
           
        },

        closeCard:(item)=>{
           
            Filter.Elements.cardOverlay.style.visibility = "hidden"
            Filter.Elements.cart.style.transform =" translateX(100%)"
        },

        addToHTML:(array)=>{
            
            array.forEach((item,index) => {
                var product=`
            <article class="product">
            <div class="img-container">
                <img id="${item.id}" src="${item.thumbnail}" class="product-img" alt="product">
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
        getProducts:(url)=>{
            fetch(url)
            .then(res => res.json())
            .then(res=>{
                    Filter.Status.products=(res.products)
                    Filter.Actions.addToHTML(Filter.Status.products);
                });
           
        }
    }
}
Filter.Actions.init()