var ProductFilter={
    Elements:{
       imgDiv:document.querySelector(".imgDiv"),
       progress:document.querySelector(".progress-div"),
       leftArrow:document.querySelector(".left-arrow"),
       rightArrow:document.querySelector(".right-arrow"),
       progressDiv:document.querySelector(".progress-div"),
       smallImgDiv:document.querySelector(".smallImgDiv"),
       productImg:document.querySelector(".product-img"),
       progress:document.querySelector(".progress"),
       contentWrapper:document.querySelector(".content-wrapper")
    },

    Status:{
        index:0,
        length:0,
        images:[],
    },
    
    Actions:{

        init:()=>{
            ProductFilter.Status.index=0;
            ProductFilter.Actions.getProduct()
            
        },

        addToIMG:(res)=>{
           
                ProductFilter.Elements.productImg.innerHTML="";
                var img=document.createElement("img");
                img.setAttribute("src",res[ProductFilter.Status.index])
                
                ProductFilter.Elements.productImg.appendChild(img)
        },

        addToProgrees:(res)=>{
                res.forEach((x,index)=>{
                    var div=document.createElement("div")
                    div.classList.add("progress-div")
                    div.classList.add("passive")
                    ProductFilter.Elements.progress.appendChild(div)
                })

                
        },

        addToSmallImg:(res)=>{
            ProductFilter.Elements.smallImgDiv.innerHTML="";
            res.forEach((x,index)=>{
                var img=document.createElement("img");
                img.setAttribute("src",x)
                img.classList.add("passive")
                // img.addEventListener("mouseover",(index)=>{
                //     ProductFilter.Status.index=index;
                //     ProductFilter.Actions.list()
                // });
                ProductFilter.Elements.smallImgDiv.appendChild(img) });

        },

        addToInfo:(res)=>{
            ProductFilter.Elements.contentWrapper.innerHTML="";
            const ratingPercentage=((res.rating)/5)*100;//4.43
            const ratingPercentageRounded=`${Math.round(ratingPercentage/10)*10}%`
            var div=
              ` <h3>${res.title}</h3>
                <p>${res.description}</p>
                <div class="star-out">
                  <div class="star-inner" style="width:${ratingPercentageRounded}">
                  </div>
                </div>
                <p>${res.discountPercentage}</p>
                <p>${res.price}$</p>
                `
                ProductFilter.Elements.contentWrapper.innerHTML=div
        },

        list:()=>{
            var progressList=document.querySelectorAll(".progress-div");
            var smallImages=document.querySelectorAll(".smallImgDiv img")
            progressList.forEach((x,index)=>{
                    if (index===(ProductFilter.Status.index)){
                        x.classList.remove("passive")
                        x.classList.add("active")

                    }
                    else{
                        x.classList.add("passive")
                    }
            });
            smallImages.forEach((x,index)=>{
                if (index===(ProductFilter.Status.index)){
                    x.classList.remove("passive")
                }
                else{
                    x.classList.add("passive")
                }
            })
            ProductFilter.Actions.addToIMG(ProductFilter.Status.images)

        },

        goLeft:()=>{
            ProductFilter.Status.index--;
            if(ProductFilter.Status.index<0){
                ProductFilter.Status.index=ProductFilter.Status.length;
            }
            
            ProductFilter.Actions.list()
        },

        goRight:()=>{
            ProductFilter.Status.index++;
            if(ProductFilter.Status.index==ProductFilter.Status.length){
                ProductFilter.Status.index=0;
            }
           
            ProductFilter.Actions.list()

        },

        getProduct:()=>{
            console.log("fdsg")
            const urlParams=new URLSearchParams(window.location.search);
            const id=urlParams.get("id");
            console.log(id)
            fetch(`https://dummyjson.com/products/${id}`)
                .then(res => res.json())
                .then(res=>{
                    ProductFilter.Status.length=res.images.length;
                    ProductFilter.Status.images=(res.images)
                    ProductFilter.Actions.addToIMG(res.images)
                    ProductFilter.Actions.addToProgrees(res.images)
                    ProductFilter.Actions.addToSmallImg(res.images)
                    ProductFilter.Actions.addToInfo(res)
                    ProductFilter.Actions.list()
                }
                    
                );
        }
    }
   
}

ProductFilter.Actions.init()