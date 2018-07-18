const puppeteer = require("puppeteer");
const fs = require("fs");


url = 'http://www.nickjr.tv/data/homeStreamPage.json?&urlKey=&apiKey=global_Nickjr_web&adfree=&repeatPattern=&page=10'


ssDB = []
seriesURLS = []
url = 'http://www.nickjr.tv/data/nav.json?path=videos-hub%2Findex&groups%5B%5D=videos-hub&groups%5B%5D=hub&groups%5B%5D=videos&pageUrlKey=videos&apiKey=global_Nickjr_web';

(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();

    await page.goto(url)

    var seriesname = await page.evaluate(() => {
        jsonData = []
        temp = JSON.parse(document.querySelector('pre').innerText)
        data = temp.main.propertyCarousel.sprites
        for (i = 0; i < data.length; i++) {

            jsonData.push({
                seriesName: data[i].title,
                seriesURL: 'http://www.nickjr.tv' + data[i].url,
                seriesAPI: 'http://www.nickjr.tv/data/property.json?urlKey=' + data[i].url.replace(/\//g, "") + '&apiKey=global_Nickjr_web'
            })
        }

        return jsonData
    })

    // console.log(seriesname[1].seriesName)
    for (i = 0; i < seriesname.length; i++) {
        seriesURLS[i] = seriesname[i].seriesAPI
    }

    for (i = 0; i < seriesname.length; i++) {
        seriesAPI = seriesURLS[i]
        seriesURL = seriesname[i].seriesURL
        seriesName = seriesname[i].seriesName

        await page.goto(seriesAPI);

        await page.waitForSelector('body');

        console.log(i + ' of ' + seriesURLS.length + ' series url: ' + seriesURL)

        var seriesDetails = await page.evaluate((seriesName, seriesURL) => {
            jsonData = []
            data = JSON.parse(document.querySelector('pre').innerText)
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


            for (s = 0; s < data.stream.length; s++) {
                for (itm = 0; itm < data.stream[s].items.length; itm++) {
                    d = new Date(data.stream[s].items[itm].data.datePosted.source)
                    release_date_formatted = d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear()
                    imgLink = ''
                    if (data.stream[s].items[itm].data.images.thumbnail) {
                        imgLink = data.stream[s].items[itm].data.images.thumbnail['r16-9']
                    }
                    // console.log(data.stream[s].items[itm].data.title)
                    duration = 0
                    if (data.stream[s].items[itm].data.duration !== null) {
                        t = data.stream[s].items[itm].data.duration.split(':')
                        duration = parseInt(t[t.length - 1]) + parseInt(t[t.length - 2]) * 60 + parseInt(t[t.length - 3] != 'undefined' ? 0 : t[t.length - 3]) * 60 * 60
                    }
                    jsonData.push({
                        series_name: seriesName, // String | For anime name,
                        title: data.stream[s].items[itm].data.title, //String | For episode title,
                        // language: '', //String | For language of this anime,
                        // episode_number: (j + 1), //Integer | For episode number
                        // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                        release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                        // release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                        synopsis: data.stream[s].items[itm].data.description, //String | Episode synopsis
                        link: 'http://www.nickjr.tv' + data.stream[s].items[itm].data.url, //String | Episode link
                        series_link: seriesURL, //String | If anime link is different then episode link.
                        video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                        image_link: imgLink, //String | episode image link.
                        // stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                        // directors: directors //Array of string | If multiple director names available.
                        // director: director //String | If only one director name is available.
                    })
                }
            }
            return jsonData
        }, seriesName, seriesURL)

        ssDB = ssDB.concat(seriesDetails)
    }




    // fs.writeFileSync('noggin_series_list.json', JSON.stringify(seriesname, null, 2))
    fs.writeFileSync('noggin_series.json', JSON.stringify(ssDB, null, 2))
    await browser.close();
})();