const puppeteer = require("puppeteer");
const fs = require("fs");



url = 'http://www.crunchyroll.com/videos/drama';

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("body");

    const dramas = await page.evaluate(() => {
        data = document.querySelectorAll('.hover-bubble')
        jsonData = []
        for (i = 0; i < data.length; i++) {


            jsonData.push({
                seriesTitle: data[i].querySelector('.series-title').innerText,
                seriesLink: data[i].querySelector('a').href
            })
        }
        return jsonData
    })

    // console.log(dramas)
    // console.log(dramas.length)
    // console.log(dramas[0].seriesLink)
    seriesDetails = []
    for (i = 0; i < dramas.length; i++) {
        seriesURL = dramas[i].seriesLink
        series_name = dramas[i].seriesTitle
        series_link = dramas[i].seriesLink

        console.log(i + ' of ' + dramas.length + ' series: ' + series_name)
        await page.goto(seriesURL);
        await page.waitForSelector("body");

        const seriesData = await page.evaluate((series_name, series_link) => {
            jsonData = []
            seasons = []
            if (document.querySelectorAll('.season').length > 0) {
                seasons = document.querySelectorAll('.season')
            }
            seasons = document.querySelectorAll('.season')
            for (s = 0; s < seasons.length; s++) {

                data = seasons[s].querySelectorAll('.hover-bubble')

                for (j = 0; j < data.length; j++) {
                    jsonData.push({
                        series_name: series_name, // String | For series name,
                        title: '', //String | For episode title,
                        language: '', //String | For language of this series,
                        episode_number: (j + 1), //Integer | For episode number
                        season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                        release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                        release_year: 0, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                        synopsis: '', //String | Episode synopsis
                        link: data[j].querySelector('a').href, //String | Episode link
                        series_link: series_link, //String | If series link is different then episode link.
                        video_length: 0, //Integer | In seconds. Always convert the episode length to time in seconds.
                        image_link: data[j].querySelector('img').src, //String | episode image link.
                        stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                        director: '', //String | If only one director name is available.
                    })
                }
            }
            return jsonData

        }, series_name, series_link)
        seriesDetails = seriesDetails.concat(seriesData)
    }
    // console.log(seriesDetails)
    for (i = 0; i<seriesDetails.length; i++) {
        episodeURL = seriesDetails[i].link

        console.log(i + ' of ' + seriesDetails.length + ' episode: ' + episodeURL)

        await page.goto(episodeURL);
        await page.waitForSelector("body");

        const episodeData = await page.evaluate((i, seriesDetails) => {
            if (document.querySelector('.description > span:nth-child(3) > a:nth-child(1)') !== null)
                document.querySelector('.description > span:nth-child(3) > a:nth-child(1)').click()
            
            if (document.querySelector('#showmedia_about_info_details > div:nth-child(3) > span:nth-child(2)') !== null)
                td = document.querySelector('#showmedia_about_info_details > div:nth-child(3) > span:nth-child(2)').innerText
            else
                td = document.querySelector('#showmedia_about_info_details > div:nth-child(2) > span:nth-child(2)').innerText
            rd=''
            if(td.indexOf(',')>0)
            rd = td.split(' ')[1].replace(',', '') + '-' + td.split(' ')[0] + '-' + td.split(' ')[2]
            seriesDetails[i].synopsis = document.querySelector('.description').innerText.replace('less', '')
            seriesDetails[i].release_date_formatted = rd
            seriesDetails[i].release_year = td.split(' ')[2]
            seriesDetails[i].title = document.querySelector('#showmedia_about_name').innerText.replace('“', '').replace('”', '') 
        }, i, seriesDetails)

    }

    fs.writeFileSync('cr_drama.json', JSON.stringify(seriesDetails))
    await browser.close();
})();