const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

url = "http://tmp.2612.fr/vgc/";

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url);
    //await page.waitForSelector('body')
    await page.waitFor(10000)
    //const window  = await page.evaluate(()=>window)
    

    const output = await page.evaluate(
        () => JSON.stringify(window.FLUX_STATE)
    );

    console.log(output)
    fs.writeFileSync('sample_output.json',output)
    await browser.close();
})();