const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')


url = 'https://news.ycombinator.com/show';

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url)
    await page.waitForSelector('body')
    const output = await page.evaluate(() => {
        jsonData =[]
        items=[]
        data = document.querySelectorAll('.athing')

        for(i=0;i<data.length;i++){
            items.push({
                title: data[i].querySelector('.storylink').innerText,
                url: data[i].querySelector('.storylink').href,
                urlSource: document.URL,
                descriptionRaw: data[i].innerHTML,
                description: data[i].innerText,
                dateCreated: '',
                price: '',
            })
        }
        
 
        jsonData.push({
            siteUrl: document.URL,
            siteName: document.title,
            categoryTags: [],

            items: items

        })

        
        return jsonData

    })
    


    console.log(output)
    // for(i=0;i<movieData.length;i++)
    fs.writeFileSync('ycombinator.json', JSON.stringify(output))
    await browser.close()
})()