const puppeteer = require("puppeteer");
const fs = require("fs");




url = 'http://www.nickjr.tv/data/homeStreamPage.json?&urlKey=&apiKey=global_Nickjr_web&adfree=&repeatPattern=&page=10'

// http://www.sesamestreet.org/node/get/json/6
// http://www.sesamestreet.org/node/get/json/9


ssDB = []
videoURLS = []
for (i = 0; i < 22; i++) {
    videoURLS[i] = 'http://www.nickjr.tv/data/homeStreamPage.json?&urlKey=&apiKey=global_Nickjr_web&adfree=&repeatPattern=&page=' + (i + 1)
}

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();




    for (i = 0; i < videoURLS.length; i++) {
        videoURL = videoURLS[i]
        // title = movies[i].movieTitle


        await page.goto(videoURL);

        await page.waitForSelector('body');

        console.log(i + ' of ' + videoURLS.length + ' movie url: ' + videoURL)

        var movieDetails = await page.evaluate(() => {
            jsonData = []

            

            data = JSON.parse(document.querySelector('pre').innerText)

            for (j = 0; j < data.stream.length; j++) {
                for (k = 0; k < data.stream[j].items.length; k++) {

                    if (data.stream[j].items[k].name === "content-item") {
                        duration = 0
                        if (data.stream[j].items[k].data.duration !== null) {
                            t = data.stream[j].items[k].data.duration.split(':')
                            duration = parseInt(t[t.length - 1]) + parseInt(t[t.length - 2]) * 60 + parseInt(t[t.length - 3] != 'undefined' ? 0 : t[t.length - 3]) * 60 * 60
                        }

                        imgLink = data.stream[j].items[k].data.images.thumbnail['r16-9']
                        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        d = new Date(data.stream[j].items[k].data.datePosted.source)
                        release_date_formatted = d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear()
                        jsonData.push({
                            // anime_name: anime_name, // String | For anime name,
                            title: data.stream[j].items[k].data.title, //String | For episode title,
                            // language: '', //String | For language of this anime,
                            // episode_number: (j + 1), //Integer | For episode number
                            // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                            release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                            // release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                            synopsis: data.stream[j].items[k].data.description, //String | Episode synopsis
                            link: 'http://www.nickjr.tv' + data.stream[j].items[k].data.url, //String | Episode link
                            // anime_link: anime_link, //String | If anime link is different then episode link.
                            video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                            image_link: imgLink, //String | episode image link.
                            // stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                            // directors: directors //Array of string | If multiple director names available.
                            // director: director //String | If only one director name is available.
                        })
                    }
                }
            }



            // jsonData = JSON.parse(document.querySelector('pre').innerText)
            return jsonData
        })






        ssDB = ssDB.concat(movieDetails)
    }

    fs.writeFileSync('noggin_videos.json', JSON.stringify(ssDB, null, 2))
    await browser.close();
})();