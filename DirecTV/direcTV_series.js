const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://www.directv.com/json/movies/search?CAROUSELS_FILTER=movies&Watch=all&hideAdultContent=true&orderby=ReleaseDate:DESCENDING&resultsetend=3000&resultsetstart=1';

totalMovies = 12337
pageSize = 1000
pages = totalMovies / pageSize
apiURLS = []
movieDB = []
// https://www.directv.com/json/tv/search?CAROUSELS_FILTER=tv&Watch=all&hideAdultContent=true&resultsetend=193&resultsetstart=163
for (i = 0; i < pages; i++) {
    apiURLS[i] = 'https://www.directv.com/json/tv/search?CAROUSELS_FILTER=tv&Watch=all&hideAdultContent=true&resultsetend=' + pageSize * (i + 1) + '&resultsetstart=' + (i * pageSize + 1)
}
console.log(apiURLS);
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
    // const jsonOutput = await page.evaluate(() => {
    //     data = JSON.parse(document.querySelector('pre').innerText)

    //     return data
    // })

    // enable the code to fetch the movieIDs
     for (i = 0; i < apiURLS.length; i++) {
        // for (i = 0; i < 20; i++) {


        apiURL = apiURLS[i]
        console.log(i + ' of ' + apiURLS.length + ' : ' + apiURL)
        await page.goto(apiURL)
        await page.waitForSelector('body');
        var movieDetails = await page.evaluate(() => {
            // cast = []
            jsonData = []
            data = JSON.parse(document.querySelector('pre').innerText)
            for (j = 0; j < data.titles.length; j++) {
                seriesLink = ''
                if(data.titles[j].seriesLinkUrl){
                    seriesLink = data.titles[j].detailsLinkUrl
                }else{
                    seriesLink = data.titles[j].seriesLinkUrl
                }
                jsonData.push({
                    seriesID: data.titles[j].tmsProgramID,
                    seriesLink: 'https://www.directv.com' + seriesLink,
                    seriesLink2: 'https://www.directv.com' + data.titles[j].detailsLinkUrl,
                    seriesTitle: data.titles[j].title,
                    release_date: data.titles[j].releaseDate,
                    synopsis: data.titles[j].description
                })
            }

            return jsonData
        })
        // console.log(castDetails.cast)
        // seriesDetails[i].stars = castDetails.cast
        // seriesDetails[i].directors = castDetails.directors
        // delete seriesDetails[i].seriesID
        // delete seriesDetails[i].episodeID
        // delete seriesDetails[i].castURL

        // jsonData.push({

        //     series_name: seriesDetails[i].series_name, // String | For anime name,
        //     title: seriesDetails[i].title, //String | For episode title,
        //     // language: language, //String | For language of this anime,
        //     episode_number: seriesDetails[i].episode_number, //Integer | For episode number
        //     season_name: seriesDetails[i].season_name, //String | Should be formatted like Season 1, Season 2.
        //     release_date_formatted: seriesDetails[i].release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
        //     release_year: seriesDetails[i].release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
        //     synopsis: seriesDetails[i].synopsis, //String | Episode synopsis
        //     link: seriesDetails[i].link, //String | Episode link
        //     series_link: seriesDetails[i].series_link, //String | If anime link is different then episode link.
        //     video_length: seriesDetails[i].video_length, //Integer | In seconds. Always convert the episode length to time in seconds.
        //     image_link: seriesDetails[i].image_link, //String | episode image link.
        //     stars: castDetails.cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
        //     directors: castDetails.directors //Array of string | If multiple director names available.
        //     // director: director //String | If only one director name is available.

        // })
        movieDB = movieDB.concat(movieDetails)
    }
    fs.writeFileSync('series_id.json', JSON.stringify(movieDB, null, 2))

    mDetails = JSON.parse(fs.readFileSync('movie_id.json'))

    // enable for next step
    /*
    for (i = 0; i < mDetails.length; i++) {

        mLink = mDetails[i].movieLink
        mTitle = mDetails[i].movieTitle
        synopsis = mDetails[i].synopsis
        rel_date = mDetails[i].release_date
        mID = mDetails[i].movieID
        console.log(i + ' of ' + mDetails.length + ' : ' + mTitle)
        await page.goto(mLink)
        await page.waitForSelector('body');
        var movieDetails = await page.evaluate((mID, mLink, mTitle, synopsis, rel_date) => {
            // cast = []
            jsonData = []
            // data = JSON.parse(document.querySelector('pre').innerText)
            release_date_formatted = ''
            release_year = 0
            if (rel_date !== "") {

                months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                t = rel_date.split('-')
                release_date_formatted = t[2] + '-' + months[t[1] - 1] + '-' + t[0]
                release_year = parseInt(t[0])
            }
            duration = 0
            if (document.querySelector("[aria-label*='Duration']")) {
                
                duration = parseInt(document.querySelector("[aria-label*='Duration']").innerText.split(' ')[0]) * 60
            }
            cast = [], directors = []
            if (document.querySelector('#cast_crew_carousel_' + mID)) {
                
                temp = document.querySelector('#cast_crew_carousel_' + mID).querySelectorAll('li')
                for (c = 0; c < temp.length; c++) {
                    if (temp[c].querySelectorAll('span')[1].innerText !== "Producer" || temp[c].querySelectorAll('span')[1].innerText !== "Director") {
                        cast.push({
                            "name": temp[c].querySelectorAll('span')[0].innerText,
                            "image_link": ""
                        })
                    }
                    if (temp[c].querySelectorAll('span')[1].innerText === "Director") {
                        directors.push(temp[c].querySelectorAll('span')[0].innerText)
                    }

                }
            }

            jsonData.push({

                // series_name: seriesDetails[i].series_name, // String | For anime name,
                title: mTitle, //String | For episode title,
                // language: language, //String | For language of this anime,
                // episode_number: seriesDetails[i].episode_number, //Integer | For episode number
                // season_name: seriesDetails[i].season_name, //String | Should be formatted like Season 1, Season 2.
                release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                synopsis: synopsis, //String | Episode synopsis
                link: mLink, //String | Episode link
                // series_link: seriesDetails[i].series_link, //String | If anime link is different then episode link.
                video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                image_link: "", //String | episode image link.
                stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                directors: directors //Array of string | If multiple director names available.
                // director: director //String | If only one director name is available.

            })


            return jsonData
        }, mID, mLink, mTitle, synopsis, rel_date)
        movieDB = movieDB.concat(movieDetails)
    }

    fs.writeFileSync('DirecTV_movies.json', JSON.stringify(movieDB, null, 2))*/
    await browser.close();
})();