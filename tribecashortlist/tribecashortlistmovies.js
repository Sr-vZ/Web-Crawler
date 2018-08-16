const puppeteer = require('puppeteer');

const fs = require('fs')

url = "https://tribecashortlist.vhx.tv/all-movies?tribecashortlista=bb101fbb-eccf-46bf-a047-4fdad36ec8ec"
movieDB = [];

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    var movieshortDetails = await page.evaluate(() => {
        data = document.querySelectorAll(".browse-item-card")
        jsonData = []
        for (i = 0; i < data.length; i++) {
            title = data[i].querySelector('strong').innerText
            link = data[i].querySelector('a').href
            imgLink = data[i].querySelector('img').src

            jsonData.push({
                // anime_name: anime_name, // String | For anime name,
                title: title, //String | For episode title,
                // language: '', //String | For language of this anime,
                // episode_number: (j + 1), //Integer | For episode number
                // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                // release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                // release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                // synopsis: synopsis, //String | Episode synopsis
                link: link, //String | Episode link
                // anime_link: anime_link, //String | If anime link is different then episode link.
                // video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                image_link: imgLink, //String | episode image link.
                // stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                // directors: directors //Array of string | If multiple director names available.
                // director: director //String | If only one director name is available.
            })

        }
        return jsonData
    })

    console.log(movieshortDetails[0].link)

    for (i = 0; i < movieshortDetails.length; i++) {
        await page.goto(movieshortDetails[i].link);
        await page.waitForSelector('body')

        title = movieshortDetails[i].title
        link = movieshortDetails[i].link
        imgLink = movieshortDetails[i].image_link

        var movieDetails = await page.evaluate((title, link, imgLink) => {
            data = document.querySelectorAll(".browse-item-card")
            jsonData = []
            for (i = 0; i < data.length; i++) {
                release_year = 0
                if (document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(1)'))
                    release_year = parseInt(document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(1)').innerText.split(' ')[0])

                synopsis = ''
                if (document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(2)')) {
                    synopsis = document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(2)').innerText
                } else if (document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(2)') && document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(3)')) {
                    synopsis = document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(2)').innerText +
                        document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(3)').innerText
                } else if (document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(2)') && document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(3)') && document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(4)')) {
                    synopsis = document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(2)').innerText +
                        document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(3)').innerText +
                        document.querySelector('.site-font-secondary-color.read-more-wrap>p:nth-child(4)').innerText
                }

                allText = document.querySelector('.site-font-secondary-color.read-more-wrap').innerText
                cast = []
                if (allText.match("CAST: (.*)\n")) {
                    castList = allText.match("CAST: (.*)\n")[1].split(', ')

                    for (c = 0; c < castList.length; c++) {
                        cast.push({
                            "name": castList[c],
                            "image_link": ''
                        })
                    }
                }
                director = ''
                if(allText.match("DIRECTOR: (.*)\n"))
                director = allText.match("DIRECTOR: (.*)\n")[1]
                jsonData.push({
                    // anime_name: anime_name, // String | For anime name,
                    title: title, //String | For episode title,
                    // language: '', //String | For language of this anime,
                    // episode_number: (j + 1), //Integer | For episode number
                    // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                    // release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                    release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                    synopsis: synopsis, //String | Episode synopsis
                    link: link, //String | Episode link
                    // anime_link: anime_link, //String | If anime link is different then episode link.
                    // video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                    image_link: imgLink, //String | episode image link.
                    stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                    // directors: directors //Array of string | If multiple director names available.
                    director: director //String | If only one director name is available.
                })

            }
            return jsonData
        }, title, link, imgLink)
        movieDB = movieDB.concat(movieDetails)
    }

    
    fs.writeFileSync('tribecash_movies.json', JSON.stringify(movieDB, null, 2))
    await browser.close();
})();