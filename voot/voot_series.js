const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')


url = 'https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=shows&subTabId=allShows&rowId=893&sortId=mostPopular&limit=50&offSet=0';
// https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=shows&subTabId=allShows&rowId=893&sortId=mostPopular&limit=20&offSet=40
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url)
    await page.waitForSelector('body')
    const totalMovies = await page.evaluate(() => {
        tmp = JSON.parse(document.querySelector('pre').innerText)
        return tmp.assets[0].totalItems
    })
    movieData = []
    fetchTimes = Math.round(totalMovies / 50)
    for (i = 0; i < fetchTimes; i++) {
        offset = i
        fetchURL = 'https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=shows&subTabId=allShows&rowId=893&sortId=mostPopular&limit=50&offSet=' + offset
        await page.goto(fetchURL)
        await page.waitForSelector('body')
        const movies = await page.evaluate(() => {
            data = JSON.parse(document.querySelector('pre').innerText)
            jsonData = []
            for (j = 0; j < data.assets[0].items.length; j++) {
                jsonData.push({
                    "series_name": data.assets[0].items[j].title,
                    "image_link": data.assets[0].items[j].imgURL,
                    "director": '',
                    "release_year": data.assets[0].items[j].yearofRelease,
                    "release_date_formatted": "",
                    "video_length": data.assets[0].items[j].duration,
                    "decsription": data.assets[0].items[j].desc,
                    "genre": data.assets[0].items[j].genre,
                    "stars": [],
                    "language": data.assets[0].items[j].language,
                    "url": 'https://www.voot.com/shows/' + data.assets[0].items[j].title.toLowerCase().replace(' ', '-').replace("'", "-") + '/' + data.assets[0].items[j].season + '/' + data.assets[0].items[j].mId
                })
            }

            return jsonData
        })
        movieData = movieData.concat(movies)

    }

    // https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=showDetaill&subTabId=allEpisodes&rowId=922&tvSeriesId=542208&sortId=oldestFirst&limit=10&offSet=0
    // https://wapiv2.voot.com/wsv_1_0/show/details.json?tvSeriesId=542208
    console.log(movieData.length)
    // for(i=0;i<movieData.length;i++)
    fs.writeFileSync('voot_series.json', JSON.stringify(movieData))

    seriesData = JSON.parse(fs.readFileSync('voot_series.json'))
    episodeData = []
    for (s = 0; s < seriesData.length; s++) {

        seriesID = seriesData[s].url.split('/')[seriesData[s].url.split('/').length - 1]
        seriesURL = seriesData[s].url
        seriesApi = 'https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=showDetaill&subTabId=allEpisodes&rowId=922&tvSeriesId=' + seriesID + '&sortId=oldestFirst&limit=50&offSet=0'
        await page.goto(seriesApi)
        await page.waitForSelector('body')
        const totalEpisodes = await page.evaluate(() => {
            tmp = JSON.parse(document.querySelector('pre').innerText)
            if (tmp.status.message === "") {
                return tmp.assets[0].totalItems
            } else {
                return 0
            }
        })
        fetchTimes = Math.round(totalEpisodes / 50)

        console.log((s + 1) + ' of ' + seriesData.length + ' url: ' + seriesURL)
        for (i = 0; i < fetchTimes; i++) {
            offset = i

            fetchURL = 'https://wapiv2.voot.com/wsv_1_0/media/assetDetails.json?tabId=showDetaill&subTabId=allEpisodes&rowId=922&tvSeriesId=' + seriesID + '&sortId=oldestFirst&limit=50&offSet=' + offset
            console.log((i + 1) + ' of ' + fetchTimes + ' url: ' + fetchURL)
            await page.goto(fetchURL)
            await page.waitForSelector('body')
            const episodes = await page.evaluate((seriesURL) => {
                data = JSON.parse(document.querySelector('pre').innerText)
                jsonData = []

                
                if (data.status.message === "") {
                    for (j = 0; j < data.assets[0].items.length; j++) {
                        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        release_date = ''
                        if (data.assets[0].items[j].telecastDate) {
                            release_date = data.assets[0].items[j].telecastDate.substring(6, 8) + '-' +
                                months[parseInt(data.assets[0].items[j].telecastDate.substring(4, 6)) - 1] +
                                '-' + data.assets[0].items[j].telecastDate.substring(0, 4)
                        }

                        jsonData.push({
                            "series_name": data.assets[0].items[j].refSeriesTitle,
                            "image_link": data.assets[0].items[j].imgURL,
                            "director": '',
                            "release_year": data.assets[0].items[j].yearofRelease,
                            "release_date_formatted": release_date,
                            "video_length": parseInt(data.assets[0].items[j].duration)/1000,
                            "synopsis": data.assets[0].items[j].desc,
                            "genre": data.assets[0].items[j].genre,
                            "stars": [],
                            "language": data.assets[0].items[j].language,
                            "series_link": seriesURL,
                            "episode_number": parseInt(data.assets[0].items[j].episodeNo),
                            "title": data.assets[0].items[j].title,
                            "season_name": 'Season ' + data.assets[0].items[j].season,
                            "link": seriesURL + '/' + data.assets[0].items[j].title.toLocaleLowerCase().replace(/ |'/g, "-").replace("?", "").replace("!", "") + '/' + data.assets[0].items[j].mId

                        })
                    }
                }
                return jsonData
            }, seriesURL)
            episodeData = episodeData.concat(episodes)

        }
        // episodeData = episodeData.concat(episodeData)
        console.log(episodeData)
    }
    fs.writeFileSync('voot_episodes.json', JSON.stringify(episodeData))
    await browser.close()
})()