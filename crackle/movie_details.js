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

// pages = 5
// for (i = 0; i < pages; i++) {
//     pagedURLS[i] = 'https://web-api-us.crackle.com/Service.svc/browse/movies/full/all/alpha-asc/US/20/' + (i + 1) + '?format=json'
// }

temp = JSON.parse(fs.readFileSync('crackle_movieList.json'))

// https://web-api-us.crackle.com/Service.svc/tooltip/channel/3566/US?format=json

for (i = 0; i < temp.length; i++) {
    movieURLS[i] = 'https://web-api-us.crackle.com/Service.svc/tooltip/channel/' + temp[i].movieID + '/US?format=json'
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

    for (p = 0; p < movieURLS.length; p++) {
        // for (i = 0; i < 10; i++) { //test run
        movieURL = movieURLS[p]
        // title = movies[i].movieTitle
        imgLink = temp[p].poster
        title = temp[p].movieTitle

        await page.goto(movieURL);

        await page.waitForSelector('body');

        console.log(p + ' of ' + movieURLS.length + ' movie url: ' + movieURL)

        var movieDetails = await page.evaluate((title, imgLink) => {

            data = JSON.parse(document.querySelector('pre').innerText)

            jsonData = []



            jsonData.push({
                movieID: data.Result.ChannelId,
                movieTitle: title,
                poster: imgLink,
                mediaID: data.Result.MediaTooltips[0].MediaId,
                synopsis: data.Result.ChannelLongDescription
            })
            
            return jsonData

        }, title, imgLink)

        console.log(movieDetails)

        // mediaURL = 'https://web-api-us.crackle.com/Service.svc/details/media/' + movieDetails[0].mediaID + '/US?disableProtocols=true&format=json'
        
        // await page.goto(mediaURL);

        // await page.waitForSelector('body');

        // console.log(p + ' of ' + movieURLS.length + ' media url: ' + mediaURL)

        // synopsis = movieDetails[0].synopsis
        // // imgLink = movieDetails.poster

        // var mediaDetails = await page.evaluate((title, imgLink,synopsis) => {

        //     data = JSON.parse(document.querySelector('pre').innerText)

        //     jsonData = []

        //     months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        //     d = new Date(data.ReleaseDate)
        //     release_date_formatted = d.getDate() +'-'+months[d.getMonth()]+'-'+d.getFullYear() 
        //     duration = data.Duration.split(':')[0]*60*60 + data.Duration.split(':')[1]*60+parseInt(data.Duration.split(':')[2])

        //     t = data.Cast.split(', ')
        //     stars=[]
        //     for(s=0;s<t.length;s++){
        //         stars.push({
        //             name: t[s],
        //             image_link:''
        //         })
        //     }

        //     jsonData.push({
        //         // anime_name: anime_name, // String | For anime name,
        //         title: title, //String | For episode title,
        //         language: data.LocalizedLanguage, //String | For language of this anime,
        //         // episode_number: (j + 1), //Integer | For episode number
        //         // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
        //         release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
        //         // release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
        //         synopsis: synopsis, //String | Episode synopsis
        //         link: 'http:'+data.PermaLink, //String | Episode link
        //         // anime_link: anime_link, //String | If anime link is different then episode link.
        //         video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
        //         image_link: imgLink, //String | episode image link.
        //         stars: stars, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
        //         directors: data.Directors.split(', ') //Array of string | If multiple director names available.
        //         // director: director //String | If only one director name is available.
        //     })
        //     return jsonData

        // }, title, imgLink,synopsis)


        kanopyDB = kanopyDB.concat(movieDetails)
        // kanopyDB = kanopyDB.concat(mediaDetails)
    }

    fs.writeFileSync('crackle_movies.json', JSON.stringify(kanopyDB, null, 2))

    await browser.close();
})();