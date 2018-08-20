const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://web-api-us.crackle.com/Service.svc/browse/movies/full/all/alpha-asc/US/20/1?format=json';
seriesIDs = []
episodeIDs = []
seriesDetails = JSON.parse(fs.readFileSync('crackle_series_incomp.json'))
temp = JSON.parse(fs.readFileSync('crackle_showlist.json'))
for (i = 0; i < temp.length; i++) {
    // seriesURLS[i] = 'https://web-api-us.crackle.com/Service.svc/channel/' + temp[i].movieID + '/playlists/all/US?format=json'
    seriesIDs[i] = temp[i].movieID
}
castURLS = []

// function getSeriesID(name){
//     for(i=0;i<temp.length;i++){
//         if(temp[i].movieTitle === name){
//             return temp[i].movieID
//         }
//     }
// }

// seriesLinkIDS=[]
// for (i = 0; i < seriesDetails.length; i++) {
//     x = seriesDetails[i].link
//     x.substring(x.lastIndexOf('/')+1,x.length)
//     episodeIDs[i] = parseInt(x)
//     seriesLinkIDS.push({
//         episodeID:episodeIDs[i],
//         seriesID:getSeriesID(seriesDetails[i].series_name)
//     })

// }

// console.log(seriesLinkIDS)
jsonData =[]
for (i = 0; i < seriesDetails.length; i++) {
    castURLS[i] = seriesDetails[i].castURL
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
    // const jsonOutput = await page.evaluate(() => {
    //     data = JSON.parse(document.querySelector('pre').innerText)

    //     return data
    // })
    for (i = 0; i < castURLS.length; i++) {
        // for (i = 0; i < 20; i++) {

        
        castURL = castURLS[i]
        console.log(i + ' of ' + castURLS.length+' : '+castURL)
        await page.goto(castURL)
        await page.waitForSelector('body');
        var castDetails = await page.evaluate(() => {
            cast = []

            castdata = JSON.parse(document.querySelector('pre').innerText)
            tmp = castdata.Result.MediaTooltips[0].Cast
            for (c = 0; c < tmp.length; c++) {
                cast.push({
                    "name": tmp[c],
                    "image_link": ""
                })
            }
            directors = castdata.Result.MediaTooltips[0].Directors
            return {
                cast: cast,
                directors: directors
            }


        })
        console.log(castDetails.cast)
        // seriesDetails[i].stars = castDetails.cast
        // seriesDetails[i].directors = castDetails.directors
        // delete seriesDetails[i].seriesID
        // delete seriesDetails[i].episodeID
        // delete seriesDetails[i].castURL

        jsonData.push({
            
            series_name: seriesDetails[i].series_name, // String | For anime name,
            title: seriesDetails[i].title, //String | For episode title,
            // language: language, //String | For language of this anime,
            episode_number: seriesDetails[i].episode_number, //Integer | For episode number
            season_name: seriesDetails[i].season_name, //String | Should be formatted like Season 1, Season 2.
            release_date_formatted: seriesDetails[i].release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
            release_year: seriesDetails[i].release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
            synopsis: seriesDetails[i].synopsis, //String | Episode synopsis
            link: seriesDetails[i].link, //String | Episode link
            series_link: seriesDetails[i].series_link, //String | If anime link is different then episode link.
            video_length: seriesDetails[i].video_length, //Integer | In seconds. Always convert the episode length to time in seconds.
            image_link: seriesDetails[i].image_link, //String | episode image link.
            stars: castDetails.cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
            directors: castDetails.directors //Array of string | If multiple director names available.
            // director: director //String | If only one director name is available.

        })

    }



    fs.writeFileSync('test.json', JSON.stringify(jsonData, null, 2))
    await browser.close();
})();