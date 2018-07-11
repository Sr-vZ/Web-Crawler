const puppeteer = require("puppeteer");
const fs = require("fs");




movieURLS = []
kanopyDB = []
movieLinks = []
// for (i = 0; i < temp.length; i++) {
//     movieURLS[i] = temp[i].movieLink
//     movieLinks[i] = temp[i].movieLink
// }

url = 'https://web-api-us.crackle.com/Service.svc/browse/movies/full/all/alpha-asc/US/20/4?format=json';


(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);

    for (i = 0; i < movieLinks.length; i++) {
        // for (i = 0; i < 10; i++) { //test run
        movieURL = movieLinks[i]
        // title = movies[i].movieTitle
        imgLink = temp[i].movieImg
        title = temp[i].movieTitle

        await page.goto(movieURL);

        await page.waitForSelector('body');

        console.log(i + ' of ' + movieLinks.length + ' movie url: ' + movieURL)

        var movieDetails = await page.evaluate((imgLink, title) => {
            jsonData = []

            release_year = 0
            cast = []
            director = ''
            language = ''
            duration = 0

            if (document.querySelector('.ui.grid.features')) {
                if (document.querySelector('.ui.grid.features').querySelectorAll('.five.wide.column') && document.querySelector('.ui.grid.features').querySelectorAll('.eleven.wide.column')) {
                    tags = document.querySelector('.ui.grid.features').querySelectorAll('.five.wide.column')
                    values = document.querySelector('.ui.grid.features').querySelectorAll('.eleven.wide.column')
                    for (t = 0; t < tags.length; t++) {
                        if (tags[t].innerText === 'Features') {
                            temp = values[t].innerText.split(', ')
                            for (c = 0; c < temp.length; c++) {
                                cast.push({
                                    name: temp[c].trim(),
                                    image_link: ''
                                })
                            }
                        }
                        if (tags[t].innerText === 'Filmmakers') {
                            director = values[t].innerText
                        }
                        if (tags[t].innerText === 'Languages') {
                            language = values[t].innerText
                        }
                        if (tags[t].innerText === 'Year') {
                            release_year = parseInt(values[t].innerText)
                        }
                        if (tags[t].innerText === 'Running Time') {
                            duration = parseInt(values[t].innerText.replace('mins', '')) * 60
                        }
                    }
                }


            }


            if (document.querySelector('.product-body'))
                synopsis = document.querySelector('.product-body').innerText


            jsonData.push({
                // anime_name: anime_name, // String | For anime name,
                title: title, //String | For episode title,
                language: language, //String | For language of this anime,
                // episode_number: (j + 1), //Integer | For episode number
                // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                // release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
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






        kanopyDB = kanopyDB.concat(movieDetails)
    }

    fs.writeFileSync('kanopy_movies.json', JSON.stringify(kanopyDB, null, 2))
    await browser.close();
})();