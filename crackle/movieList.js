const puppeteer = require("puppeteer");
const fs = require("fs");




movieURLS = []
kanopyDB = []
pagedURLS = []
// for (i = 0; i < temp.length; i++) {
//     movieURLS[i] = temp[i].movieLink
//     movieLinks[i] = temp[i].movieLink
// }

url = 'https://web-api-us.crackle.com/Service.svc/browse/movies/full/all/alpha-asc/US/20/4?format=json';

pages = 5
for (i = 0; i < pages; i++) {
    pagedURLS[i] = 'https://web-api-us.crackle.com/Service.svc/browse/movies/full/all/alpha-asc/US/20/' + (i + 1) + '?format=json'
}

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

    for (p = 0; p < pagedURLS.length; p++) {
        // for (i = 0; i < 10; i++) { //test run
        movieURL = pagedURLS[p]
        // title = movies[i].movieTitle
        // imgLink = temp[i].movieImg
        // title = temp[i].movieTitle

        await page.goto(movieURL);

        await page.waitForSelector('body');

        console.log(p + ' of ' + pagedURLS.length + ' page url: ' + movieURL)

        var movieDetails = await page.evaluate(() => {

            data = JSON.parse(document.querySelector('pre').innerText)

            jsonData = []

            for (i = 0; i < data.Entries.length; i++) {

                jsonData.push({
                    movieID: data.Entries[i].ID,
                    movieTitle: data.Entries[i].Title,
                    poster: data.Entries[i].OneSheetImage_800_1200
                })



            }





            // jsonData.push({
            //     // anime_name: anime_name, // String | For anime name,
            //     title: title, //String | For episode title,
            //     language: language, //String | For language of this anime,
            //     // episode_number: (j + 1), //Integer | For episode number
            //     // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
            //     // release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
            //     release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
            //     synopsis: synopsis, //String | Episode synopsis
            //     link: document.URL, //String | Episode link
            //     // anime_link: anime_link, //String | If anime link is different then episode link.
            //     video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
            //     image_link: imgLink, //String | episode image link.
            //     stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
            //     // directors: directors //Array of string | If multiple director names available.
            //     director: director //String | If only one director name is available.
            // })
            return jsonData

        })






        kanopyDB = kanopyDB.concat(movieDetails)
    }

    fs.writeFileSync('crackle_movielist.json', JSON.stringify(kanopyDB, null, 2))
    
    await browser.close();
})();