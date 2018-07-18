const puppeteer = require("puppeteer");
const fs = require("fs");


url = 'http://www.nickjr.tv/data/homeStreamPage.json?&urlKey=&apiKey=global_Nickjr_web&adfree=&repeatPattern=&page=10'


ssDB = []
seriesURLS = []
url = 'http://www.nickjr.tv/data/nav.json?path=videos-hub%2Findex&groups%5B%5D=videos-hub&groups%5B%5D=hub&groups%5B%5D=videos&pageUrlKey=videos&apiKey=global_Nickjr_web';

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();

    await page.goto(url)

    var seriesname = await page.evaluate(() => {
        jsonData = []
        temp = JSON.parse(document.querySelector('pre').innerText)
        data = temp.main.propertyCarousel.sprites
        for (i = 0; i < data.length; i++) {

            jsonData.push({
                seriesName: data[i].title,
                seriesURL: 'http://www.nickjr.tv' + data[i].url,
                seriesAPI: 'http://www.nickjr.tv/data/property.json?urlKey=' + data[i].url.replace(/\//g, "") + '&apiKey=global_Nickjr_web'
            })
        }

        return jsonData
    })

    console.log(seriesname[1].seriesName)

    // fs.writeFileSync('noggin_series_list.json', JSON.stringify(seriesname, null, 2))
    await browser.close();
})();