const fs = require("fs");
const puppeteer = require("puppeteer");

temp = JSON.parse(fs.readFileSync('shudder_seriesLinks.json'))

seriesLinks = []

for (i = 0; i < temp.length; i++) {
    seriesLinks[i] = temp[i].seriesLink
}
ssDB = []
url = seriesLinks[0];

(async () => {
    const browser = await puppeteer.launch({
        args: [
            "--proxy-server=104.245.69.26:3128"
        ],
        headless: false
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)

    for (i = 0; i < seriesLinks.length; i++) {
        seriesLink = seriesLinks[i]
        seriesName = temp[i].seriesName

        console.log(i + ' of ' + seriesLinks.length + ' series name: ' + seriesName)

        await page.goto(seriesLink)
        await page.waitForSelector('body')
        // await page.waitFor(5000)

        var seriesDetails = await page.evaluate((seriesLink, seriesName) => {
            jsonData = []

            data = document.querySelectorAll('.season-list__item')
            eptrack = []
            for (d = 0; d < data.length; d++) {

                duration = 0
                eptitle = ''
                epno = 0
                synopsis = ''
                eptitle = data[d].querySelector('.episode-details__title').innerHTML.split('. ')[1]
                epno = parseInt(data[d].querySelector('.episode-details__title').innerHTML.split('. ')[0])
                if (epno === null || isNaN(epno)) {
                    epno = parseInt(data[d].querySelector('.episode-details__title').innerText.split(' Ep. ')[1])
                    eptitle = data[d].querySelector('.episode-details__title').innerText
                }
                eptrack.push(epno)
                season = 1
                if (eptrack[d - 1] > eptrack[d]) {
                    season++
                }

                synopsis = data[d].querySelector('.episode-details>p:nth-child(2)').innerHTML
                duration = data[d].querySelector('.episode-details>p:nth-child(3)').innerHTML.replace('min', '') * 60
                image_link = data[d].querySelector('img').src
                eplink = data[d].querySelector('a').href

                jsonData.push({
                    series_name: seriesName, //String | For series name
                    title: eptitle, //String | For episode title
                    // language: data[i].language, //String | For language of this series.
                    // languages: Array of string | If multiple languages available use this instead of language.
                    episode_number: epno, //Integer | For episode number
                    season_name: 'Season ' + season, //String | Should be formatted like Season 1, Season 2.
                    // release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                    // release_year: parseInt(data[i].production_year), //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                    synopsis: synopsis, //String | Episode synopsis
                    link: eplink, //String | Episode link
                    series_link: seriesLink, //String | If series link is different then episode link.
                    video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                    image_link: image_link, //String | episode image link.
                    // stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                    // director: data[i].director, //String | If only one director name is available.
                    // directors: Array of string | If multiple director names available.
                })
            }


            return jsonData
        }, seriesLink, seriesName)

        ssDB = ssDB.concat(seriesDetails)
    }


    await browser.close()

    fs.writeFileSync('shudder_series.json', JSON.stringify(ssDB, null, 2))
})()

// temp =  document.querySelectorAll('.season-list__item')
// temp[25].querySelector('.episode-details__title').innerHTML.split('. ')
// temp[25].querySelector('.episode-details>p:nth-child(3)').innerHTML
// temp[25].querySelector('p:nth-child(2)').innerHTML