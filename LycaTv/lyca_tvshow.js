const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')

url = 'https://www.lycatv.tv/tvshows';



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
    showData = []
    const showList = await page.evaluate(() => {
        jsonData = []
        cont = document.querySelectorAll('.hover.ehover2')
        for (i = 0; i < cont.length; i++) {
            jsonData.push({
                title: cont[i].querySelector('div > h2 > b').innerText,
                series_name: cont[i].querySelector('div > h2 > b').innerText,
                link: '',
                image_link: cont[i].querySelector('img').src,
                synopsis: cont[i].querySelector('.tv_des').innerText
            })
        }
        return jsonData
    })
    fs.writeFileSync('lyca_tvshows.json', JSON.stringify(showList, null, 2))
    await browser.close();
})();