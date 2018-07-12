const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://web-api-us.crackle.com/Service.svc/browse/movies/full/all/alpha-asc/US/20/1?format=json';


(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);
    const jsonOutput = await page.evaluate(()=>{
        data = JSON.parse(document.querySelector('pre').innerText)

        return data
    })
    

    fs.writeFileSync('test.json', JSON.stringify(jsonOutput, null, 2))
    await browser.close();
})();