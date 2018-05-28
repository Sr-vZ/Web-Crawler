const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')

url = 'https://www.zee5.com/movies/all'; //zee tv all movies;


(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    apiUrls = []
    for (pageNo = 1; pageNo < 10; pageNo++) {
        apiUrls.push('https://catalogapi.zee5.com/v1/movie?asset_subtype=movie&sort_by_field=release_date&sort_order=DESC&page=' + pageNo +
            '&page_size=100&genres=Action,Awards,Classical,Action%20%26%20Adventure,Adventure,Animation,Contemporary,Cookery,Crime,Docudrama,Emotional,Fantasy,Festive,Fiction,Ghazal,Horror,Indi%20pop,Instrumental,Item%20song,Jazz,Mash-up,Movie,Music,Musical,Mystery,Party,Patriotic,Pop,Qawwali,Rap,Remix,Rock,Wedding%20song,Thriller,Sufi,Sports,Sci-Fi%20%26%20Fantasy,Romantic,Romance&languages=hi,en,mr,te,kn,ta,ml,bn,gu,pa,hr,or&country=IN&translation=en&log=tvshow')
    }
    data = [], details = []

    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')
    for (i = 0; i < apiUrls.length; i++) {
        apiURL = apiUrls[i]
        console.log('fetching apiurl ' + (i + 1) + ' of ' + apiUrls.length)
        await page.goto(apiURL)
        await page.waitForSelector('body')
        const apiData = await page.evaluate(() => {
            var jsonData = [],
                details = []
            jsonData.push(JSON.parse(document.body.innerText))
            for (j = 0; j < jsonData[0].items.length; j++) {
                details.push({
                    'title': jsonData[0].items[j].title,
                    'genre': Object.values(jsonData[0].items[j].genres),
                    'image_link': '',
                    'synopsis': '',
                    'length': secsToHHMMSS(jsonData[0].items[j].duration),
                    'url': '',
                    'director': '',
                    'stars': '',
                    'language': '',
                })
            }
            return details;
        })
        fs.writeFileSync('zee_test.json',apiData)
        console.log(apiData.items)
        data.push(apiData)
    }
    //console.log(data.length)
    fs.writeFileSync('zee_movies.json', data)

    await browser.close();
})();

function secsToHHMMSS(sec) {
    var date = new Date(null);
    date.setSeconds(sec); // specify value for SECONDS here
    var result = date.toISOString().substr(11, 8);
    return result
}