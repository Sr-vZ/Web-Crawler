const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        args: [
            "--proxy-server=75.109.208.168:54342"
        ],
        headless: false
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)

    url = 'https://www.shudder.com/series'
    await page.goto(url);
    await page.waitForSelector('body');

    var seriesLinks = await page.evaluate(() => {
        data = document.querySelectorAll('.series-list-container__tile')
        jsonData = []
        for (i = 0; i < data.length; i++) {
            jsonData.push({
                "seriesName": data[i].querySelector('h5').innerHTML,
                "seriesLink": data[i].querySelector('a').href
            })
        }
        return jsonData
    })


    await browser.close()

    fs.writeFileSync('shudder_seriesLinks.json', JSON.stringify(seriesLinks, null, 2))
})()