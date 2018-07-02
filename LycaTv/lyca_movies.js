const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')

url = 'https://www.lycatv.tv/movies';

temp = JSON.parse(fs.readFileSync('lyca_movies.json'))
movieLinks = [], lycaDB = [];
for (i = 0; i < temp.length; i++) {
    movieLinks[i] = temp[i].link
}

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);

    for (i = 0; i < movieLinks.length; i++) {
        movieURL = movieLinks[i]
        // title = movies[i].movieTitle
        imgLink = temp[i].imgLink
        title = temp[i].title

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
        console.log(i + ' of ' + movieLinks.length + ' movie url: ' + movieURL)

        var movieDetails = await page.evaluate((imgLink, title) => {
            jsonData = []

            release_year = 0
            cast = []
            if (document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_left > p:nth-child(2)')) {
                temp = document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_left > p:nth-child(2)').innerText.replace('Cast: ', '').split(', ')
                for (c = 0; c < temp.length; c++) {
                    cast.push({
                        name: temp[c].trim(),
                        image_link: ''
                    })
                }
            }
            duration = 0
            if (document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(1)')) {
                if (document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(1)').innerText.replace('Duration:', '') !== "") {
                    duration = parseInt(document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(1)').innerText.replace('Duration: ', '').replace('mins', '')) * 60
                    if (isNaN(duration) || duration === null)
                        duration = parseInt(parseInt(document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(1)').innerText.replace('Duration: ', '').split(' ')[0].replace('h', '')) * 60 + parseInt(document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(1)').innerText.replace('Duration: ', '').split(' ')[1].replace('m', ''))) * 60
                    if (isNaN(duration) || duration === null)
                        duration = parseInt(parseInt(document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(1)').innerText.replace('Duration: ', '').split(' ')[0]) * 60 + parseInt(document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(1)').innerText.replace('Duration: ', '').split(' ')[2])) * 60
                }
            }
            if (document.querySelector('body > section.movie_des_area > div > div > div > div > div > p.mov_para'))
                synopsis = document.querySelector('body > section.movie_des_area > div > div > div > div > div > p.mov_para').innerText
            if (document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(4)'))
                release_date_formatted = document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_right > p:nth-child(4)').innerText.replace('Release: ', '').replace(/ /g, '-')
            if (document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_left > p:nth-child(3)'))
                director = document.querySelector('body > section.movie_des_area > div > div > div > div > div > div.mov_info > div.info_left > p:nth-child(3)').innerText.replace('Director: ', '')
            jsonData.push({
                // anime_name: anime_name, // String | For anime name,
                title: title, //String | For episode title,
                // language: '', //String | For language of this anime,
                // episode_number: (j + 1), //Integer | For episode number
                // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                // release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                synopsis: synopsis, //String | Episode synopsis
                link: document.URL, //String | Episode link
                // anime_link: anime_link, //String | If anime link is different then episode link.
                video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                image_link: imgLink, //String | episode image link.
                stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                // directors: directors //Array of string | If multiple director names available.
                director: director //String | If only one director name is available.
            })
            return jsonData
        }, imgLink, title)






        lycaDB = lycaDB.concat(movieDetails)
    }

    fs.writeFileSync('lyca_movies.json', JSON.stringify(lycaDB, null, 2))
    await browser.close();
})();