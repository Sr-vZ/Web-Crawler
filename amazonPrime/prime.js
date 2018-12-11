const fs = require('fs')

const puppeteer = require("puppeteer");



function primeVideoTVShow(tvURL) {
    (async () => {

        const browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        await page.goto(tvURL);
        await page.waitForSelector('body')


        var tvDetails = await page.evaluate(() => {
            jsonData = []
            season = document.querySelector('#atf > div > span > span').innerText
            year = document.querySelector('[data-automation-id="release-year-badge"]').innerText
            series = document.querySelector('[data-automation-id="title"]').innerText
            director = document.querySelector('.av-additional-details-section.avu-page-section').querySelector('[data-automation-id="info-meta-elem-link"]').innerText

            data = document.querySelectorAll('.avu-context-card')
            for (i = 0; i < data.length; i++) {

                if (data[i].querySelector('.av-play-title-text')) {
                    if (data[i].querySelector('.av-play-title-text').innerText.split('.').length === 2) {
                        eptitle = data[i].querySelector('.av-play-title-text').innerText.split('.')[1]
                        epno = data[i].querySelector('.av-play-title-text').innerText.split('.')[0]
                    } else {
                        eptitle = data[i].querySelector('.av-play-title-text').innerText
                        epno = ''
                    }
                } else {
                    if (data[i].querySelector('h3').innerText.split('.').length === 2) {
                        eptitle = data[i].querySelector('h3').innerText.split('.')[1]
                        epno = data[i].querySelector('h3').innerText.split('.')[0]
                    } else {
                        eptitle = data[i].querySelector('h3').innerText
                        epno = ''
                    }
                }


                d = data[i].querySelector('[data-automation-id^="ep-air-date-badge"]').innerText.split(' ')
                release_date_formatted = d[1] + '-' + d[0] + '-' + d[2]

                if (data[0].querySelector('a')) {
                    eplink = data[0].querySelector('a').href
                } else {
                    eplink = ''
                }
                if (data[i].querySelector('[data-automation-id^="ep-runtime-badge"]')) {
                    duration = parseInt(data[i].querySelector('[data-automation-id^="ep-runtime-badge"]').innerText.split(' ')[0]) * 60
                } else {
                    duration = 0
                }

                jsonData.push({
                    series_name: series, //String | For series name
                    title: eptitle, //String | For episode title
                    // language: data[i].language, //String | For language of this series.
                    // languages: Array of string | If multiple languages available use this instead of language.
                    episode_number: epno, //Integer | For episode number
                    season_name: season, //String | Should be formatted like Season 1, Season 2.
                    release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                    release_year: year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                    synopsis: data[i].querySelector('.av-episode-synopsis').innerText, //String | Episode synopsis
                    link: eplink, //String | Episode link
                    series_link: document.URL, //String | If series link is different then episode link.
                    video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                    image_link: data[i].querySelector('.av-bgimg__div').style.backgroundImage.replace('url("', '').replace('")', ''), //String | episode image link.
                    // stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                    // director: data[i].director, //String | If only one director name is available.
                    // directors: Array of string | If multiple director names available.
                })
            }

            return jsonData
        })


        fs.writeFileSync('amazonPrime.json', JSON.stringify(tvDetails, null, 2))
        await browser.close();
    })();
}


tvURL = 'https://www.primevideo.com/region/eu/detail/0LPIP7N3YF6AF0641BL3I71ULB/ref=atv_tv_hom_c_KPskct_brws_5_2'
primeVideoTVShow(tvURL)