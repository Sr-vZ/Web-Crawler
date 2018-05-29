const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')

url = 'https://www.zee5.com/movies/all'; //zee movies all;

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    console.log('Scrolling through page');

    // await autoScroll(page);

    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            try {
                const maxScroll = Number.MAX_SAFE_INTEGER;
                let lastScroll = 0;
                const interval = setInterval(() => {
                    window.scrollBy(0, 100);
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
    // console.log('Dimensions:', dimensions);
    const movieData = await page.evaluate(() => {
        jsonData = []
        data = document.querySelectorAll('.grid')

        for (i = 0; i < data.length; i++) {
            jsonData.push({
                "movietitle": data[i].querySelector('h3').innerText,
                "image_link": data[i].querySelector('img').src,
                "link_host_name": '',
                "director": '',
                "release_year": "",
                "release_date_formatted": "",
                "video_length": data[i].querySelector('.label-subTitle').innerText,
                "decsription": "",
                "genre": "",
                "stars": [],
                "language": "",
                "url": data[i].querySelector('a').href
            })
        }
        return jsonData
    })

    // console.log(movieData[0].link)
    videoDetails =[]
    for (i = 0; i < movieData.length; i++) {
        movieURL = movieData[i].url
        console.log('fetching ' + (i + 1) + ' of ' + movieData.length + ' url: ' + movieURL)
        await page.goto(movieURL)
        await page.waitFor('body')
        await page.click('.read')
        const videoData = await page.evaluate(() => {
            var jsonData = [],
                description = '',
                stars = []

            if (document.querySelectorAll('.description').length > 0)
                description = document.querySelector('.description').innerText

            if (document.querySelectorAll('.outer1').length > 0) {
                temp = document.querySelector('.outer1').querySelectorAll('.title2')
                for (s = 0; s < temp.length; s++) {
                    stars[s] = temp[s].innerText
                }
            }


            jsonData.push({
                'url': document.URL,
                'description': description,
                'release_date_formatted': document.querySelector('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(1) > td:nth-child(2)').innerText,
                'director': document.querySelector('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText,
                'genre': document.querySelector('.title3').innerText.split('.')[0].trim(),
                'language': document.querySelector('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(5) > td:nth-child(2)').innerText,
                'stars': stars
            });
            return jsonData;
        })

        videoDetails.push(videoData)
    }

    for (i = 0; i < movieData.length; i++) {

        movieData[i].release_date_formatted = videoDetails[i][0].release_date_formatted
        movieData[i].description = videoDetails[i][0].description
        movieData[i].language = videoDetails[i][0].language
        movieData[i].director = videoDetails[i][0].director
        movieData[i].genre = videoDetails[i][0].genre
        movieData[i].stars = videoDetails[i][0].stars

    }
    // console.log(videoDetails[0][0].date_published)
    // console.log(movieData)
    fs.writeFileSync('zee_movies1.json', JSON.stringify(movieData))
    await browser.close();
})();