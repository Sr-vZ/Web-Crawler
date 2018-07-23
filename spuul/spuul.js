const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')


url = 'https://api.spuul.com/named_queries/3/items?page=1&per_page=30&access_token=b13e1a0940bf0b50e8a6adda821b884021044472c17495c8b332d130e35b4264&region=Asia%2FCalcutta';

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        // 'Host': 'api.yuppflix.com',
        // 'Origin': 'https://www.yuppflix.com',
        // 'Referer': 'https://www.yuppflix.com/movies',
        // 'session-id': 'YF-f5697e08-5a17-4005-9933-db0f6deb8ff1',
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36',
        // 'Content-Type': 'application/json',
        // 'box-id': 'c98a90f2-f648-a864-ba13-6881f2eda3f0'
        'authority': 'api.spuul.com',

        'if-none-match': 'W/"1c49fbeb1cb2a44ca43791ec673bb172"',
        'x-request-id': '3bc8ea32-3371-4407-9af8-c9d1ee456051',
        'etag': 'W/"1c49fbeb1cb2a44ca43791ec673bb172"',
        'x-amz-cf-id': '8zY4zrgfpjfheZ5Pdouj2g4nnJ657hvPuiy_9N4SCMj7vESAe0V12w==',
        'x-instance': 'i-03eb08d54a1b823f0'

    });

    await page.goto(url)

    // var movieData = JSON.parse(fs.readFileSync('yupp_movies.json'))
    // console.log(movieData[0].url)
    // var movieDetails = []
    // for (i = 0; i < movieData.length; i++) {
    //     movieCode = movieData[i].url.split("/")[movieData[i].url.split("/").length - 1];
    //     detailsURL = 'https://api.yuppflix.com/yupptv/yuppflix/api/v1/movies/movie/details?code=' + movieCode + '&country=IN&lang=All'
    //     console.log('url ' + (i + 1) + ' of ' + movieData.length + ' :' + detailsURL)
    //     await page.goto(detailsURL)
    //     await page.waitForSelector('body')
    //     const mDetails = await page.evaluate(() => {
    //         jsonData = [];
    //         data = JSON.parse(document.querySelector("pre").innerText);
    //         stars = []
    //         temp = data.response.movieDetails.newCastCrew;
    //         for (j = 0; j < temp.length; j++) {
    //             if (temp[j].role === 'Actor') {
    //                 stars.push({
    //                     name: temp[j].name,
    //                     image_link: temp[j].iconUrl
    //                 });
    //             }
    //         }

    //         jsonData.push({
    //             director: data.response.movieDetails.castCrew.director,

    //             video_length: data.response.movieDetails.duration,
    //             decsription: data.response.movieDetails.description,
    //             genre: data.response.movieDetails.genre,
    //             stars: stars,

    //             url: "https://www.yuppflix.com/movies/watch/" +
    //                 data.response.movieDetails.code
    //         });

    //         return jsonData
    //     })
    //     movieDetails.push(mDetails)
    // }

    // for (i = 0; i < movieData.length; i++) {
    //     movieData[i].director = movieDetails[i][0].director
    //     movieData[i].video_length = movieDetails[i][0].video_length
    //     movieData[i].decsription = movieDetails[i][0].description
    //     movieData[i].genre = movieDetails[i][0].genre
    //     movieData[i].stars = movieDetails[i][0].stars
    // }
    // console.log(movieData)
    // fs.writeFileSync('yupp_movies1.json', JSON.stringify(movieData))
    // await browser.close()
})()