const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://rocket-cdn.us.britbox.com/lists/a-z?device=web_browser&order=asc&order_by=a-z&page=1&page_size=9&param&segments=US';
seriesIDs = []
//https://rocket-cdn.us.britbox.com/page?c=rw&device=web_browser&item_detail_expand=all&item_detail_select_season=first&list_page_size=18&max_list_prefetch=3&path=%2Fshow%2F_The_Queens_Christmas_Message_15091&segments=US&text_entry_format=html&v=1.16.110
pageSize =  4


(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    
    for (i = 0; i < pageSize; i++) {
        // for (i = 0; i < 20; i++) {

        
        apiURL = 'https://rocket-cdn.us.britbox.com/lists/a-z?device=web_browser&order=asc&order_by=a-z&page='+(i+1)+'&page_size=100&param&segments=US'
        console.log(i + ' of ' + pageSize+' : '+apiURL)
        await page.goto(apiURL)
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