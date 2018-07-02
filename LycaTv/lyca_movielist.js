const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')

url = 'https://www.lycatv.tv/movies';

(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    console.log('Scrolling through page');

    // await autoScroll(page);

    for (i = 0; i < 25; i++) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                try {
                    const maxScroll = Number.MAX_SAFE_INTEGER;
                    let lastScroll = 0;
                    const interval = setInterval(() => {
                        window.scrollBy(0, 1000);
                        const scrollTop = document.documentElement.scrollTop;
                        if (scrollTop === maxScroll || scrollTop === lastScroll) {
                            clearInterval(interval);
                            resolve();
                        } else {
                            lastScroll = scrollTop;
                        }
                    }, 500);
                } catch (err) {
                    console.log(err);
                    reject(err.toString());
                }
            });
        });
        await page.click('#view_more')
    }
    movieData = []
    const movieList  =  await page.evaluate(() => {
        jsonData = []
        cont = document.querySelectorAll('.fil_con')
        for (i = 0; i < cont.length; i++) {
            jsonData.push({
                title: cont[i].querySelector('div > span > b').innerText,
                link: cont[i].querySelector('a').href,
                imgLink: cont[i].querySelector('img').src
            })
        }
        return jsonData
    })

    
    fs.writeFileSync('lyca_movieList.json', JSON.stringify(movieList,null,2))
    await browser.close();
})();