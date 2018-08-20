const puppeteer = require("puppeteer");
const fs = require("fs");

seriesURLS = []

temp = JSON.parse(fs.readFileSync('crackle_showlist.json'))
crackleDB = []
'https://web-api-us.crackle.com/Service.svc/nowplaying/2479492/513/US?format=json'
// console.log(temp[0].movieID)
for (i = 0; i < temp.length; i++) {
    seriesURLS[i] = 'https://web-api-us.crackle.com/Service.svc/channel/' + temp[i].movieID + '/playlists/all/US?format=json'
}

(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    // const page2 = await browser.newPage();
    // await page.goto(url);
    // await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);

    for (i = 0; i < seriesURLS.length; i++) {
        // for (i = 0; i < 10; i++) { //test run
        movieURL = seriesURLS[i]
        // title = movies[i].movieTitle
        // imgLink = temp[i].movieImg
        // title = temp[i].movieTitle
        seriesID = temp[i].movieID
        await page.goto(movieURL);

        await page.waitForSelector('body');

        console.log(i + ' of ' + seriesURLS.length + ' page url: ' + movieURL)

        var movieDetails = await page.evaluate((seriesID) => {

            data = JSON.parse(document.querySelector('pre').innerText)

            jsonData = []
            if (data.Status.messageCode !== '115') {
                for (j = 0; j < data.Playlists[0].Items.length; j++) {

                    // jsonData.push({
                    //     movieID: data.Entries[i].ID,
                    //     movieTitle: data.Entries[i].Title,
                    //     poster: data.Entries[i].OneSheetImage_800_1200
                    // })


                    
                    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    d = new Date(data.Playlists[0].Items[j].MediaInfo.AirDate)
                    release_date_formatted = d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear()

                    jsonData.push({
                        seriesID:seriesID,
                        episodeID:data.Playlists[0].Items[j].MediaInfo.Id,
                        castURL:'https://web-api-us.crackle.com/Service.svc/nowplaying/' + data.Playlists[0].Items[j].MediaInfo.Id + '/' + seriesID + '/US?format=json',
                        series_name: data.Playlists[0].Items[j].MediaInfo.ShowName, // String | For anime name,
                        title: data.Playlists[0].Items[j].MediaInfo.Title, //String | For episode title,
                        // language: language, //String | For language of this anime,
                        episode_number: parseInt(data.Playlists[0].Items[j].MediaInfo.Episode), //Integer | For episode number
                        season_name: 'Season ' + data.Playlists[0].Items[j].MediaInfo.Season, //String | Should be formatted like Season 1, Season 2.
                        release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                        release_year: parseInt(data.Playlists[0].Items[j].MediaInfo.ReleaseYear), //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                        synopsis: data.Playlists[0].Items[j].MediaInfo.Description, //String | Episode synopsis
                        link: 'https://www.sonycrackle.com/' + data.Playlists[0].Items[j].MediaInfo.ShowName.toLocaleLowerCase().replace(/ /g, '-') + '/' + data.Playlists[0].Items[j].MediaInfo.Id, //String | Episode link
                        series_link: 'https://www.sonycrackle.com/' + data.Playlists[0].Items[j].MediaInfo.ShowName.toLocaleLowerCase().replace(/ /g, '-'), //String | If anime link is different then episode link.
                        video_length: data.Playlists[0].Items[j].MediaInfo.Duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                        image_link: data.Playlists[0].Items[j].MediaInfo.Images.Img_1920x1080, //String | episode image link.
                        stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                        directors: [] //Array of string | If multiple director names available.
                        // director: director //String | If only one director name is available.

                    })

                }
            }


            return jsonData
        }, seriesID)

        crackleDB = crackleDB.concat(movieDetails)
    }

    fs.writeFileSync('crackle_series_incomp.json', JSON.stringify(crackleDB, null, 2))

    await browser.close();
})();