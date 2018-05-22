var fs = require("fs");

var Nightmare = require("nightmare");
var vo = require("vo");

const nightmare = Nightmare({
  show: false
});


url = "https://www.chanel.com/en_WW/fashion/products/sunglasses/page-2.html";

channelData =[]

nightmare
    .goto(url)
    .wait('body')
    .evaluate(()=>{
        channelData = []
        data = document.querySelectorAll(".fs-products-grid__product");
        for(i=0;i<data.length;i++){
            channelData.push({
                product_link : data[i].querySelector('a').href,
                product_image : data[i].querySelector('img').src,
                price : data[i].querySelector('.fs-products-grid__product__price').innerText,
                product_name : data[i].querySelector('.fs-products-grid__product__name').querySelector('span').innerText
            })
        }
        console.log(channelData)
        return channelData
    })
    .end()
    .then((res)=>{

        fs.appendFileSync("channel.json", JSON.stringify(res));
    })