const puppeteer = require("puppeteer");
const fs = require("fs");

temp = JSON.parse(fs.readFileSync('hallmark_seriesList.json'))

// console.log(temp[0].movieLink)

seriesURLS = [],episodeList=[]

for (let index = 0; index < temp.length; index++) {
    seriesURLS[index] = temp[index].movieLink
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)

    for (i = 0; i < seriesURLS.length; i++) {
        seriesURL = seriesURLS[i]

        await page.goto(seriesURL);
        console.log(i + ' of ' + seriesURLS.length + ' movie url: ' + seriesURL)
        // await page.waitForSelector("body");
        await page.waitFor("body");


        movies = []

        var movieList = await page.evaluate(() => {

            jsonData = []
            data = document.querySelectorAll('tbody tr')
            for (i = 0; i < data.length; i++) {
                /* temp = data[i].querySelector('.list-unstyled').innerText.replace('Runtime:', '').trim().split(' ')
                hour = parseInt(temp[0])
                min = parseInt(temp[2])
                seconds = (hour * 60 + min) * 60 */
                temp = data[i].querySelector('td:nth-child(3)').innerText.split(' ')
                duration = 0
                if (temp.length === 4) {
                    duration = parseInt(temp[0]) * 60 * 60 + parseInt(temp[2]) * 60
                } else {
                    duration = parseInt(temp[0]) * 60
                }
                jsonData.push({
                    seriesName: document.querySelector('h2').innerText.split('S1')[0].trim(),
                    episodeLink: data[i].querySelector('a').href,
                    // imgLink: data[i].querySelector('img').src,
                    episodeTitle: data[i].querySelector('td:nth-child(2)').innerText,
                    // synopsis: data[i].querySelectorAll('p')[1].innerText,
                    duration: duration,
                    seasonNo: data[i].querySelector('td:nth-child(1)').innerText.split(',')[0].trim(),
                    episodeNo: parseInt(data[i].querySelector('td:nth-child(1)').innerText.split(',')[1].replace('Episode', '').trim())
                })
            }
            return jsonData    
        })
        episodeList = episodeList.concat(movieList)
    }

    fs.writeFileSync('hallmark_episodeList.json', JSON.stringify(episodeList))

    hallmarkDB = []
    for (i = 0; i < episodeList.length; i++) {
        movieURL = episodeList[i].episodeLink
        title = episodeList[i].episodeTitle
        // imgLink = movieList[i].movieImg
        duration = episodeList[i].duration
        // synopsis = movieList[i].synopsis
        series_name = episodeList[i].seriesName
        season = episodeList[i].seasonNo
        episode_number = episodeList[i].episodeNo
        episodeTitle = episodeList[i].episodeTitle

        await page.goto(movieURL);
        /* await page.waitForSelector("body")
            .catch(err => {
                console.log(err)
                return
            }) */
        await page.waitForSelector('body');
        // page.waitForNavigation({
        //     waitUntil: 'domcontentloaded'
        // })
        console.log(i + ' of ' + episodeList.length + ' movie url: ' + movieURL)

        var movieDetails = await page.evaluate((duration, title, movieURL, series_name, season, episode_number, episodeTitle) => {
            jsonData = []

            release_year = 0
            cast = []
            if (document.querySelector('#details > div.row.preview > div > div:nth-child(2) > div > p:nth-child(2)')) {
                temp = document.querySelector('#details > div.row.preview > div > div:nth-child(2) > div > p:nth-child(2)').innerText.replace('Starring: ', '').split(',')
                for (c = 0; c < temp.length; c++) {
                    cast.push({
                        name: temp[c].trim(),
                        image_link: ''
                    })
                }
            }
            // series_name = document.querySelector('h2').innerText.split('S1')[0].trim()

            // table = document.querySelector('.table.table-hover').querySelectorAll('tbody > tr')
            imgLink = ''
            if (document.querySelector('.keyart')) {
                imgLink = document.querySelector('.keyart').src
            }
            synopsis =''
            if (document.querySelector('.summary')){
                synopsis = document.querySelector('.summary').innerText
            }
            // tmp = table[0].querySelector('a').innerText.split(',')
            // if (document.querySelector('h2'))
            // title = table[t].querySelector('td:nth-child(2)').innerText
            // duration = duration = (parseInt(table[t].querySelector('td:nth-child(3)').innerText.split(' ')[0]) * 60 + parseInt(table[t].querySelector('td:nth-child(3)').innerText.split(' ')[2])) * 60
            // if (document.querySelector('#expanded-details > div > div > div:nth-child(1) > p:nth-child(4)'))
            //     release_year = parseInt(document.querySelector('#expanded-details > div > div > div:nth-child(1) > p:nth-child(4)').innerText)
            jsonData.push({
                series_name: series_name, // String | For anime name,
                title: title, //String | For episode title,
                // language: '', //String | For language of this anime,
                episode_number: episode_number, //Integer | For episode number
                season_name: season, //String | Should be formatted like Season 1, Season 2.
                // release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                // release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                synopsis: synopsis, //String | Episode synopsis
                link: movieURL, //String | Episode link
                series_link: movieURL, //String | If anime link is different then episode link.
                video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                image_link: imgLink, //String | episode image link.
                stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                // directors: directors //Array of string | If multiple director names available.
            })

            return jsonData
        }, duration, title, movieURL, series_name, season, episode_number, episodeTitle)






        hallmarkDB = hallmarkDB.concat(movieDetails)
    }



    fs.writeFileSync('hallmark_series_details.json', JSON.stringify(hallmarkDB))
    await browser.close();
})();