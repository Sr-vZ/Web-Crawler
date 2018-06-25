const fs = require('fs')
const puppeteer = require('puppeteer')
var page = []
tmp = JSON.parse(fs.readFileSync('mubi_movieList.json'));
movieURLS = []
for (i = 0; i < tmp.length; i++) {
    movieURLS[i] = tmp[i].movieLink
}
// movieURLS = 



(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    numOfTabs = 2
    for (t = 0; t < numOfTabs; t++) {
        page[t] = await browser.newPage();
        await page[t].setDefaultNavigationTimeout(0)
    }

    // await page.goto(url);


    mubiDB = []
    for (i = 0; i < tmp.length/numOfTabs; i++) {
        for(t=0;t<numOfTabs;t++){
            movieURL = tmp[i+t].movieLink
            title = tmp[i+t].movieTitle
            imgLink = tmp[i+t].movieImg     
            getData(t, movieURL, title, imgLink)
        }
        
    }

    fs.writeFileSync('mubi_faster.json', JSON.stringify(mubiDB))
    await browser.close();

})();
/* process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
    // browser.close();
    // page[t].reload()
}); */

async function getData(tabIndex, movieURL, title, imgLink) {
    /* movieURL = tmp[i].movieLink
    title = tmp[i].movieTitle
    imgLink = tmp[i].movieImg */
    await page[tabIndex].goto(movieURL);
    /* await page.waitForSelector("body")
        .catch(err => {
            console.log(err)
            return
        }) */
    await page[tabIndex].waitFor(1000);
    // page.waitForNavigation({
    //     waitUntil: 'domcontentloaded'
    // })
    console.log(tabIndex + ' of ' + tmp.length + ' movie url: ' + movieURL)

    var movieDetails = await page[tabIndex].evaluate((title, imgLink) => {
        jsonData = []

        duration = 0;
        synopsis = ''
        directors = []
        release_year = 0
        if (document.querySelector('time'))
            duration = parseInt(document.querySelector('time').innerText) * 60
        if (document.querySelector('.film-show__descriptions__synopsis').querySelector('p'))
            synopsis = document.querySelector('.film-show__descriptions__synopsis').querySelector('p').innerText
        if (document.querySelector('.listed-directors'))
            directors = document.querySelector('.listed-directors').innerText.split(',')
        if (document.querySelector('.film-show__country-year'))
            release_year = parseInt(document.querySelector('.film-show__country-year').innerText.split(',')[document.querySelector('.film-show__country-year').innerText.split(',').length - 1])
        jsonData.push({
            // anime_name: anime_name, // String | For anime name,
            title: title, //String | For episode title,
            // language: '', //String | For language of this anime,
            // episode_number: (j + 1), //Integer | For episode number
            // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
            // release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
            release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
            synopsis: synopsis, //String | Episode synopsis
            link: document.URL, //String | Episode link
            // anime_link: anime_link, //String | If anime link is different then episode link.
            video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
            image_link: imgLink, //String | episode image link.
            stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
            directors: directors //Array of string | If multiple director names available.
        })
        return jsonData
    }, title, imgLink)

    castURL = movieURL + '/cast'
    await page[tabIndex].goto(castURL);
    /* await page.waitForSelector("body")
        .catch(err => {
            console.log(err)
            return
        })
*/
    await page[tabIndex].waitFor(1000);
    // page.waitForNavigation({
    //     waitUntil: 'domcontentloaded'
    // })
    var castDetails = await page[tabIndex].evaluate(() => {
        stars = []
        data = document.querySelectorAll('.cast_member')
        for (c = 0; c < data.length; c++) {
            if (data[c].querySelector('.cast-member-media__subheader')) {
                if (data[c].querySelector('.cast-member-media__subheader').innerText === 'CAST' || data[c].querySelector('.cast-member-media__subheader').innerText === 'SELF')
                    stars.push({
                        name: data[c].querySelector('.cast-member-media__header').innerText,
                        image_link: data[c].querySelector('img').src
                    })
            }
        }
        return stars
    })

    movieDetails[0].stars = castDetails

    mubiDB = mubiDB.concat(movieDetails)
}