const puppeteer = require("puppeteer");
const fs = require("fs");



url = 'http://www.crunchyroll.com/videos/anime';

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("body");

    const animeList = await page.evaluate(() => {
        load_more = document.querySelector('.load-more')
        style = window.getComputedStyle(load_more)

        while (style.display != 'none') {
            load_more.click()

        }


        data = document.querySelectorAll('.hover-bubble')
        jsonData = []
        for (i = 0; i < data.length; i++) {


            jsonData.push({
                animeTitle: data[i].querySelector('.series-title').innerText,
                animeLink: data[i].querySelector('a').href
            })
        }
        return jsonData
    })

    // console.log(animeList)
    // console.log(animeList.length)
    // console.log(animeList[0].animeLink)
    animeDetails = []
    for (i = 0; i < animeList.length; i++) {
        animeURL = animeList[i].animeLink
        anime_name = animeList[i].animeTitle
        anime_link = animeList[i].animeLink

        console.log(i + ' of ' + animeList.length + ' anime: ' + anime_name)
        await page.goto(animeURL);
        await page.waitForSelector("body");

        const animeData = await page.evaluate((anime_name, anime_link) => {
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
                        anime_name: anime_name, // String | For anime name,
                        title: '', //String | For episode title,
                        language: '', //String | For language of this anime,
                        episode_number: (j + 1), //Integer | For episode number
                        season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                        release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                        release_year: 0, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                        synopsis: '', //String | Episode synopsis
                        link: data[j].querySelector('a').href, //String | Episode link
                        anime_link: anime_link, //String | If anime link is different then episode link.
                        video_length: 0, //Integer | In seconds. Always convert the episode length to time in seconds.
                        image_link: data[j].querySelector('img').src, //String | episode image link.
                        stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                        director: '', //String | If only one director name is available.
                    })
                }
            }
            return jsonData

        }, anime_name, anime_link)
        animeDetails = animeDetails.concat(animeData)
    }
    // console.log(animeDetails)
    for (i = 0; i < animeDetails.length; i++) {
        episodeURL = animeDetails[i].link

        console.log(i + ' of ' + animeDetails.length + ' episode: ' + episodeURL)

        await page.goto(episodeURL);
        await page.waitForSelector("body");

        var episodeData = await page.evaluate(() => {
            jsonData = []

            if (document.querySelector('.description > span:nth-child(3) > a:nth-child(1)') !== null)
                document.querySelector('.description > span:nth-child(3) > a:nth-child(1)').click()

            if (document.querySelector('#showmedia_about_info_details > div:nth-child(3) > span:nth-child(2)') !== null)
                td = document.querySelector('#showmedia_about_info_details > div:nth-child(3) > span:nth-child(2)').innerText
            else
                td = document.querySelector('#showmedia_about_info_details > div:nth-child(2) > span:nth-child(2)').innerText
            rd = ''
            if (td.indexOf(',') > 0)
                rd = td.split(' ')[1].replace(',', '') + '-' + td.split(' ')[0] + '-' + td.split(' ')[2]

            title =''
            if(document.querySelector('#showmedia_about_name')!==null)
            title = document.querySelector('#showmedia_about_name').innerText.replace('“', '').replace('”', '')
            jsonData.push({
                synopsis: document.querySelector('.description').innerText.replace('less', ''),
                release_date_formatted: rd,
                release_year: td.split(' ')[2],
                title: title
            })
            return jsonData
        })
        animeDetails[i].synopsis = episodeData[0].synopsis
        animeDetails[i].release_date_formatted = episodeData[0].release_date_formatted
        animeDetails[i].release_year = episodeData[0].release_year
        animeDetails[i].title = episodeData[0].title
    }

    fs.writeFileSync('cr_anime.json', JSON.stringify(animeDetails))
    await browser.close();
})();