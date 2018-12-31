const fs = require('fs')
// const request = require('request')
const puppeteer = require("puppeteer");

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    // return response;

    url = 'https://www.hotstar.com/movies/languages/hindi'
    maxMovie = 100 // api single request limit
    erosDB = []
    totalMovies = 0;

    (async () => {

        const browser = await puppeteer.launch({
            headless: false
        });
        // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('body')

        // console.log('Scrolling through page');

        // await autoScroll(page);
        // const jsonOutput = await page.evaluate(() => {
        //     data = JSON.parse(document.querySelector('pre').innerText)

        //     return data
        // })

        console.log('Scrolling through page');

        // await autoScroll(page);

        /*
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                try {
                    const maxScroll = Number.MAX_SAFE_INTEGER;
                    let lastScroll = 0;
                    const interval = setInterval(() => {
                        window.scrollBy(0, 500);
                        const scrollTop = document.documentElement.scrollTop;
                        if (scrollTop === maxScroll || scrollTop === lastScroll) {
                            // window.scrollTo(0,500)
                            clearInterval(interval);
                            resolve();
                        } else {
                            lastScroll = scrollTop;

                            // window.scrollTo(0,500)
                        }
                    }, 2000);
                } catch (err) {
                    console.log(err);
                    reject(err.toString());
                }
            });
        });
        */
        for (i = 0; i < 30; i++) {
            await page.evaluate('window.scrollBy(0, document.body.scrollHeight)')
            await page.waitFor(1000)
            await page.evaluate('window.scrollTo(0, 0)')
        }

        console.log('Scoll Complete!')

        // console.log(i + ' of ' + fetchURLS.length + ' : ' + fetchURL)
        // await page.goto(fetchURL)
        // await page.waitForSelector('body');
        var movieDetails = await page.evaluate(() => {
            jsonData = []
            data = document.querySelectorAll('article')
            for (m = 0; m < data.length; m++) {
                free = true
                if (data[m].querySelector('.badge')) {
                    free = false
                }
                movie_url = data[m].querySelector('a').href

                jsonData.push({
                    title: data[m].querySelector('span').innerText,
                    link: movie_url,
                    is_free: free
                })
            }

            return jsonData
        })
        console.log(movieDetails)
        console.log('Total movies fetched: ', movieDetails.length)
        fs.writeFileSync('hotstarMovies.json', JSON.stringify(movieDetails, null, 2))
        await browser.close();
    })();

    return movieDetails
};