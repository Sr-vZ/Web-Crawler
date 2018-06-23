const puppeteer = require("puppeteer");
const fs = require("fs");

const args = process.argv;
// console.log(args);


const url = args[2]; //"http://tmp.2612.fr/vgc/";
const proxyURL = args[3]; //'https://exampleproxy.com:8080' //add proxy url with port no here
const username = args[4]; //'bob'; // user name for the proxy
const password = args[5]; //'password123'; //password for the proxy
if (url && proxyURL && username && password) {
    console.log('Accessing url: ' + url + ' with proxy: ' + proxyURL)
} else if (url && proxyURL) {
    console.log('Accessing url: ' + url + ' with proxy: ' + proxyURL + ' usename: ' + username + ' password: ' + password);
} else {
    console.log('Accessing url: ' + url)
}

(async () => {

    if (proxyURL) {
        var browser = await puppeteer.launch({
            headless: false,
            args: ['--proxy-server=proxyUrl'],
        });
        const page = await browser.newPage();
        if (username || password) {
            await page.authenticate({
                username,
                password
            });
        }
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
    } else {
        var browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        if (username || password) {
            await page.authenticate({
                username,
                password
            });
        }
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
    }

})();