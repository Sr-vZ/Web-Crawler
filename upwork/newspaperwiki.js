const fs = require('fs')
const puppeteer = require("puppeteer");



function searchNewsPaper(newsPaper) {
    (async () => {

        url = "https://en.wikipedia.org/wiki/" + newsPaper.replace(/ /, '_')
        const browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('body')


        var wikiDetails = await page.evaluate((newsPaper) => {
            jsonData = []
            
            if(document.querySelector('.infobox.vcard')){
                n = document.querySelector('.infobox.vcard').querySelectorAll('td').length 
                npLink = document.querySelector('.infobox.vcard').querySelectorAll('td')[n-1].querySelector('a').href

            }else if(document.querySelector('#External_links')){
                externalLinks = document.querySelector('#External_links').parentElement
                npLink = externalLinks.nextElementSibling.querySelector('a').href
            }else{
                npLink = "Does not exist"
            }
            

            jsonData.push({
                NewsPaper: newsPaper,
                Wikipedia_Page: document.URL,
                NewsPaper_Link: npLink

            })


            return jsonData
        })


        fs.appendFileSync('news.json', JSON.stringify(wikiDetails, null, 2))
        await browser.close();
    })();
}


tvURL = 'https://www.primevideo.com/region/eu/detail/0LPIP7N3YF6AF0641BL3I71ULB/ref=atv_tv_hom_c_KPskct_brws_5_2'

news = ['Bisbee Daily Review','Ahwatukee Foothills News','Visalia Times-Delta','Augusta Chronicle','The Courier-Journal','Wyoming Tribune Eagle']
for(i=0;i<news.length;i++){
    
}
searchNewsPaper(news[5])    