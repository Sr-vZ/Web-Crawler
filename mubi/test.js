const fs = require('fs')

const cheerio = require('cheerio')
const async = require('async')
const request = require('request').defaults({
    timeout: 300000
})

tmp = JSON.parse(fs.readFileSync('mubi_movieList.json'));
movieURLS = []
for (i = 0; i < tmp.length; i++) {
    movieURLS[i] = tmp[i].movieLink
}
// request.setTimeout(0)
var urls = ["http://example.com", "http://example.com", "http://example.com"];
urls = movieURLS
i = 0
var data = [];
var calls = urls.map((url) => (cb) => {
    request(url, (error, response, body) => {
        if (error) {
            console.error("We've encountered an error:", error);
            return cb();
        }

        $ = cheerio.load(body)
        console.log(i++ + ' of ' + movieURLS.length + ' ' + url)

        // fs.appendFileSync('dump.json', JSON.stringify(html))
        // fs.appendFileSync('dump_response.json', JSON.stringify(response))
        jsonData = []

        duration = 0;
        synopsis = ''
        directors = []
        release_year = 0
        if ($('time'))
            duration = parseInt($('time').text()) * 60
        if ($('.film-show__descriptions__synopsis > p'))
            synopsis = $('.film-show__descriptions__synopsis > p').text()
        if ($('#trailer-region > section > div > div > div.film-show__info-flex > div.film-show__info > div.film-show__directors.row > div > span'))
            directors = $('#trailer-region > section > div > div > div.film-show__info-flex > div.film-show__info > div.film-show__directors.row > div > span').text().split(',')
        if ($('.film-show__country-year'))
            release_year = parseInt($('.film-show__country-year').text().split(',')[$('.film-show__country-year').text().split(',').length - 1])
        jsonData.push({
            // anime_name: anime_name, // String | For anime name,
            title: '', //String | For episode title,
            // language: '', //String | For language of this anime,
            // episode_number: (j + 1), //Integer | For episode number
            // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
            // release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
            release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
            synopsis: synopsis, //String | Episode synopsis
            link: url, //String | Episode link
            // anime_link: anime_link, //String | If anime link is different then episode link.
            video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
            image_link: '', //String | episode image link.
            stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
            directors: directors //Array of string | If multiple director names available.
        })


        data = data.concat(jsonData)




    })
})

async.parallel(calls, () => {
    /* YOUR CODE HERE */
    fs.writeFileSync('data_dump.json', JSON.stringify(mubi))

})