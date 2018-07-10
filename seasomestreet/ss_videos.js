const puppeteer = require("puppeteer");
const fs = require("fs");




url ='http://www.sesamestreet.org/videos?vid=1788'

// http://www.sesamestreet.org/node/get/json/6
// http://www.sesamestreet.org/node/get/json/9

ids = [9,6,13,8,4,12,7,5,54,41,39,40,45]
ssDB = []
videoURLS=[]
for (i = 0; i < ids.length; i++) {
    videoURLS[i] = 'http://www.sesamestreet.org/node/get/json/'+ids[i]    
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

            // release_year = 0
            // cast = []
            // director = ''
            // language = ''
            // duration = 0

            // if (document.querySelector('.ui.grid.features')) {
            //     if (document.querySelector('.ui.grid.features').querySelectorAll('.five.wide.column') && document.querySelector('.ui.grid.features').querySelectorAll('.eleven.wide.column')) {
            //         tags = document.querySelector('.ui.grid.features').querySelectorAll('.five.wide.column')
            //         values = document.querySelector('.ui.grid.features').querySelectorAll('.eleven.wide.column')
            //         for (t = 0; t < tags.length; t++) {
            //             if (tags[t].innerText === 'Features') {
            //                 temp = values[t].innerText.split(', ')
            //                 for (c = 0; c < temp.length; c++) {
            //                     cast.push({
            //                         name: temp[c].trim(),
            //                         image_link: ''
            //                     })
            //                 }
            //             }
            //             if (tags[t].innerText === 'Filmmakers') {
            //                 director = values[t].innerText
            //             }
            //             if (tags[t].innerText === 'Languages') {
            //                 language = values[t].innerText
            //             }
            //             if (tags[t].innerText === 'Year') {
            //                 release_year = parseInt(values[t].innerText)
            //             }
            //             if (tags[t].innerText === 'Running Time') {
            //                 duration = parseInt(values[t].innerText.replace('mins', '')) * 60
            //             }
            //         }
            //     }


            // }


            // if (document.querySelector('.product-body'))
            //     synopsis = document.querySelector('.product-body').innerText


            // jsonData.push({
            //     // anime_name: anime_name, // String | For anime name,
            //     title: title, //String | For episode title,
            //     language: '', //String | For language of this anime,
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

            jsonData = JSON.parse(document.querySelector('pre').innerText)
            return jsonData
        })






        ssDB = ssDB.concat(movieDetails)
    }

    fs.writeFileSync('ss_videos.json', JSON.stringify(ssDB, null, 2))
    await browser.close();
})();