const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://www.viceland.com/en_us/shows';


(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    
    const jsonOutput = await page.evaluate(()=>{
        data = document.querySelectorAll('.show-item-details')
        jsonData = []
        for(i=0;i<data.length;i++){

            jsonData.push({
                title : data[i].querySelector('a').innerText,
                link : data[i].querySelector('a').href
            })
        }

        return jsonData
    })
    

    fs.writeFileSync('showlinks.json', JSON.stringify(jsonOutput, null, 2))
    await browser.close();
})();