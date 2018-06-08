const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')


url = 'https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=movieDetail&subTabId=allMovies&rowId=923&sortId=mostPopular&limit=50&offSet=0';

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url)
    await page.waitForSelector('body')
    const totalMovies = await page.evaluate(() => {
        tmp = JSON.parse(document.querySelector('pre').innerText)
        return tmp.assets[0].totalItems
    })
    movieData = []
    fetchTimes = Math.round(totalMovies/50)
    for(i=0;i<fetchTimes;i++){
        offset = i*50
        fetchURL='https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=movieDetail&subTabId=allMovies&rowId=923&sortId=mostPopular&limit=50&offSet='+offset
        await page.goto(fetchURL)
        await page.waitForSelector('body')
        const movies = await page.evaluate(() => {
            data = JSON.parse(document.querySelector('pre').innerText)
            jsonData =[]
            function msToHMS( ms ) {
                // 1- Convert to seconds:
                var seconds = ms / 1000;
                // 2- Extract hours:
                var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
                seconds = seconds % 3600; // seconds remaining after extracting hours
                // 3- Extract minutes:
                var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
                // 4- Keep only seconds not extracted to minutes:
                seconds = parseInt(seconds % 60);
                return ( hours+":"+minutes+":"+seconds);
            }
            for(j=0;j<data.assets[0].items.length;j++){
            jsonData.push({
                "movietitle": data.assets[0].items[j].name,
                "image_link": data.assets[0].items[j].imgURL,
                "director": '',
                "release_year": data.assets[0].items[j].yearofRelease ,
                "release_date_formatted": "",
                "video_length": msToHMS(data.assets[0].items[j].duration),
                "decsription": data.assets[0].items[j].desc,
                "genre": data.assets[0].items[j].genre,
                "stars": [],
                "language": data.assets[0].items[j].language,
                "url": 'https://www.voot.com/movie/'+data.assets[0].items[j].title.toLowerCase().replace(' ','-')+'/'+data.assets[0].items[j].mId
            })
        }
        return jsonData
        })
        movieData = movieData.concat(movies)

    }

    
    console.log(movieData.length)
    // for(i=0;i<movieData.length;i++)
    fs.writeFileSync('voot_movies.json', JSON.stringify(movieData))
    await browser.close()
})()