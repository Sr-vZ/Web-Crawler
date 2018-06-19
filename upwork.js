const puppeteer = require("puppeteer");
const fs = require("fs");

url = "http://tmp.2612.fr/vgc/";
const proxyURL = 'https://exampleproxy.com:8080' //add proxy url with port no here
const username = 'bob'; // user name for the proxy
const password = 'password123'; //password for the proxy
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server=${proxyUrl}'],
    });
    const page = await browser.newPage();
    await page.authenticate({
        username,
        password
    });
    await page.goto(url);
    //await page.waitForSelector('body')
    await page.waitFor(10000)
    //const window  = await page.evaluate(()=>window)


    const output = await page.evaluate(
        () => JSON.stringify(window.FLUX_STATE)
    );

    console.log(output)
    fs.writeFileSync('sample_output.json', output)
    await browser.close();
})();