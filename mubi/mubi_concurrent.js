const PromisePool = require('es6-promise-pool')
const puppeteer = require('puppeteer')
const fs = require("fs")
var _ = require("lodash");
// How may urls we want to process in parallel.
const CONCURRENCY = 5;

// Urls to process.
// const URLS = [
//     'http://example.com',
//     'http://news.ycombinator.com',
//     'https://news.ycombinator.com/news?p=2',
//     'https://news.ycombinator.com/news?p=3',
//     'https://news.ycombinator.com/news?p=4',
//     'https://news.ycombinator.com/news?p=5',
//     'https://www.reddit.com/',
// ];

tmp = JSON.parse(fs.readFileSync('mubi_movieList.json'));
movieURLS = [], titles = [], imgLinks = []
length = tmp.length
// length = 50
for (i = 0; i < length; i++) {
    movieURLS[i] = tmp[i].movieLink
    titles[i] = tmp[i].movieTitle
    imgLinks[i] = tmp[i].movieImg
}

URLS = movieURLS

let browser;
let results = [],
    mubiDB = [];
i = 0;

// This function returns promise that gets resolved once Puppeteer
// opens url, evaluates content and closes it.
const crawlUrl = async (url) => {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)



    // idx = _.findIndex(movieURLS, url)
    idx = _.findIndex(tmp, function (k) {
        return k.movieLink == url
    });
    console.log(idx + ' of ' + length + ' movie url: ' + url)


    castURL = url + '/cast'
    await page.goto(castURL, {
        waituntil: 'load'
    });
    /* await page.waitForSelector("body")
        .catch(err => {
            console.log(err)
            return
        })
*/
    // await page.waitFor(1000);
    // page.waitForNavigation({
    //     waitUntil: 'domcontentloaded'
    // })
    var castDetails = await page.evaluate(() => {
        stars = []
        if (document.querySelectorAll('.cast_member').length > 0) {
            data = document.querySelectorAll('.cast_member')
            for (c = 0; c < data.length; c++) {
                if (data[c].querySelector('.cast-member-media__subheader')) {
                    if (data[c].querySelector('.cast-member-media__subheader').innerText === 'CAST' || data[c].querySelector('.cast-member-media__subheader').innerText === 'SELF')
                        stars.push({
                            name: data[c].querySelector('.cast-member-media__header').innerText,
                            image_link: data[c].querySelector('img').src
                        })
                }
            }
        }
        return stars
    })
    console.log(`Opening ${url}`);
    await page.goto(url, {
        waituntil: 'load'
    });
    // await page.waitForS(1000);

    console.log(`Evaluating ${url}`);
    const result = await page.evaluate(() => {
        return {
            title: document.title,
            url: window.location.href,
        };
    });

    // movieDetails['stars'] = castDetails
    title = titles[idx]
    imgLink = imgLinks[idx]

    var movieDetails = await page.evaluate((title, imgLink, castDetails) => {
        jsonData = []

        duration = 0;
        synopsis = ''
        directors = []
        release_year = 0
        if (document.querySelector('time'))
            duration = parseInt(document.querySelector('time').innerText) * 60
        if (document.querySelector('.film-show__descriptions__synopsis').querySelector('p'))
            synopsis = document.querySelector('.film-show__descriptions__synopsis').querySelector('p').innerText
        if (document.querySelector('.listed-directors'))
            directors = document.querySelector('.listed-directors').innerText.split(',')
        if (document.querySelector('.film-show__country-year'))
            release_year = parseInt(document.querySelector('.film-show__country-year').innerText.split(',')[document.querySelector('.film-show__country-year').innerText.split(',').length - 1])
        jsonData.push({
            // anime_name: anime_name, // String | For anime name,
            title: title, //String | For episode title,
            // language: '', //String | For language of this anime,
            // episode_number: (j + 1), //Integer | For episode number
            // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
            // release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
            release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
            synopsis: synopsis, //String | Episode synopsis
            link: document.URL, //String | Episode link
            // anime_link: anime_link, //String | If anime link is different then episode link.
            video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
            image_link: imgLink, //String | episode image link.
            stars: castDetails, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
            directors: directors //Array of string | If multiple director names available.
        })
        return jsonData
    }, title, imgLink, castDetails)
    mubiDB = mubiDB.concat(movieDetails)
    results.push(result);

    console.log(`Closing ${url}`);
    await page.close();
};

// Every time it's called takes one url from URLS constant and returns 
// crawlUrl(url) promise. When URLS gets empty returns null.
const promiseProducer = () => {
    const url = URLS.pop();

    return url ? crawlUrl(url) : null;
};

(async () => {
    // Starts browser.
    try {


        browser = await puppeteer.launch({
            headless: true
        });

        // Runs thru all the urls in a pool of given concurrency.
        const pool = new PromisePool(promiseProducer, CONCURRENCY);
        await pool.start();

        // Print results.
        console.log('Results:');
        console.log(JSON.stringify(results, null, 2));
        fs.writeFileSync('mubi_test4.json', JSON.stringify(mubiDB, null, 2))
        // await Apify.setValue('OUTPUT', results);
        await browser.close();
    } catch (error) {
        console.log('error caught: ' + error)
    }
})();