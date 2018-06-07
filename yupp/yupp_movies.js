const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')


url = 'https://api.yuppflix.com/yupptv/yuppflix/api/v1/movies/list?sort=&genres=&country=IN&lang=All&count=100000&last_index=-1&sections=All';

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Host': 'api.yuppflix.com',
        'Origin': 'https://www.yuppflix.com',
        'Referer': 'https://www.yuppflix.com/movies',
        'session-id': 'YF-347d5759-bf9d-4ba8-b002-41cd796c937a',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36',
        'Content-Type': 'application/json',
        'box-id': '064e7d58-869f-806b-2644-5b97a1ca0c9d'
    });
    await page.goto(url);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);

    // await page.evaluate(async () => {
    //     await new Promise((resolve, reject) => {
    //         try {
    //             const maxScroll = Number.MAX_SAFE_INTEGER;
    //             let lastScroll = 0;
    //             const interval = setInterval(() => {
    //                 window.scrollBy(0, 1000);
    //                 const scrollTop = document.documentElement.scrollTop;
    //                 if (scrollTop === maxScroll || scrollTop === lastScroll) {
    //                     clearInterval(interval);
    //                     resolve();
    //                 } else {
    //                     lastScroll = scrollTop;
    //                 }
    //             }, 500);
    //         } catch (err) {
    //             console.log(err);
    //             reject(err.toString());
    //         }
    //     });
    // });

    const movieData = await page.evaluate(() => {
        jsonData = []
        data =  JSON.parse(document.querySelector('pre').innerText)
        
        for (i = 0; i < data.movies.length; i++) {
            release_date= new Date(data.movies[i].releaseDate)
            jsonData.push({
                "movietitle": data.movies[i].name,
                "image_link": data.movies[i].backgroundImage,
                "director": '',
                "release_year": release_date.getFullYear() ,
                "release_date_formatted": release_date.toISOString(),
                "video_length": "",
                "decsription": "",
                "genre": "",
                "stars": [],
                "language": data.movies[i].language,
                "url": 'https://www.yuppflix.com/movies/watch/'+data.movies[i].code
            })
        }
        return jsonData
    })
    console.log(movieData)
    fs.writeFileSync('yupp_movies.json', JSON.stringify(movieData))

    await browser.close()
})()