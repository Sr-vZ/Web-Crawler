const PromisePool = require('es6-promise-pool')
const puppeteer = require('puppeteer')
const fs = require("fs")


const CONCURRENCY = 5

totalPages = 416
pagedURLS = []
for (i = 0; i < totalPages; i++) {
    pagedURLS[i] = 'https://mubi.com/films?page=' + (i + 1) + '&sort=title'
}


i=0;
movies = []
const crawlUrl = async (url) => {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)

    console.log((i + 1) + ' of ' + totalPages + ' movie url: ' + url)
    console.log(`Opening ${url}`);
    await page.goto(url, { waituntil: 'load' });
    // await page.waitForS(1000);

    console.log(`Evaluating ${url}`);
    // const result = await page.evaluate(() => {
    //     return {
    //         title: document.title,
    //         url: window.location.href,
    //     };
    // });
    var movieDetails = await page.evaluate(() => {
        data = document.querySelectorAll('.film-tile')
        jsonData = []
        imgSrc = ''
        for (i = 0; i < data.length; i++) {
            if (data[i].querySelector('.film-thumb'))
                imgSrc = data[i].querySelector('.film-thumb').src

            jsonData.push({
                movieTitle: data[i].querySelector('.film-title').innerText,
                movieLink: data[i].querySelector('.film-link').href,
                movieImg: imgSrc
            })
        }
        return jsonData
    })
    movies = movies.concat(movieDetails)
    
    

    console.log(`Closing ${url}`);
    await page.close();
};

// Every time it's called takes one url from URLS constant and returns 
// crawlUrl(url) promise. When URLS gets empty returns null.
const promiseProducer = () => {
    const url = pagedURLS.pop();

    return url ? crawlUrl(url) : null;
};

(async () => {
    // Starts browser.
    browser = await puppeteer.launch({
        headless: true
    });

    // Runs thru all the urls in a pool of given concurrency.
    const pool = new PromisePool(promiseProducer, CONCURRENCY);
    await pool.start();

    // Print results.
    console.log('Results:');
    // console.log(JSON.stringify(results, null, 2));
    console.log(JSON.stringify(movies, null, 2));
    fs.writeFileSync('mubi_movieList.json', JSON.stringify(movies, null, 2))
    // await Apify.setValue('OUTPUT', results);
    await browser.close();
})();