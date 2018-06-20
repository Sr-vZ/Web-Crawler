const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://mubi.com/films?sort=title';

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("body");

    const pages = await page.evaluate(() => {
        p = document.querySelectorAll('.page-number')
        return parseInt(p[p.length - 1].innerText)
    })

    for (i = 0; i < pages; i++) {
        pagedURL = 'https://mubi.com/films?page=' + (i + 1) + '&sort=title'
        await page.goto(url);
        await page.waitForSelector("body");

        const movies = await page.evaluate(() => {
            data = document.querySelectorAll('.film-tile')
            jsonData = []
            for (i = 0; i < data.length; i++) {


                jsonData.push({
                    movieTitle: data[i].querySelector('.film-title').innerText,
                    movieLink: data[i].querySelector('film-link').href,
                    movieImg: data[i].querySelector('.film-thumb').src
                })
            }
            return jsonData
        })

    }

    fs.writeFileSync('mubi.json', JSON.stringify(''))
    await browser.close();
})();