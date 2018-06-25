const fs = require('fs')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const async = require('async')
var request = require('request')


tmp = JSON.parse(fs.readFileSync('mubi_movieList.json'));
movieURLS = []
for (i = 0; i < tmp.length; i++) {
    movieURLS[i] = tmp[i].movieLink
}

var mubi=[]
var myLoaderQueue = []; // passed to async.parallel
var myUrls = ['http://...', 'http://...', 'http://...'] // 1000+ urls here
myUrls = movieURLS
for (var i = 0; i < myUrls.length; i++) {
    (function (URLIndex) {
        myLoaderQueue.push(function (callback) {

            // Async http request
            request(myUrls[URLIndex], function (error, response, html) {

                // Some processing is happening here before the callback is invoked
                if (html) {
                    $ = cheerio.load(html)
                    console.log(URLIndex + ' of ' + myUrls.length + ' ' + myUrls[URLIndex])
                    $()
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
                        link: myUrls[URLIndex], //String | Episode link
                        // anime_link: anime_link, //String | If anime link is different then episode link.
                        video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                        image_link: '', //String | episode image link.
                        stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                        directors: directors //Array of string | If multiple director names available.
                    })


                    mubi.concat(jsonData)
                        callback(error, html);
                    

                }

            });
        });
    })(i);
}

// The loader queue has been made, now start to process the queue
async.parallel(myLoaderQueue, function (err, results) {
    // Done
    fs.writeFileSync('data_dump.json', JSON.stringify(mubi))

   
});