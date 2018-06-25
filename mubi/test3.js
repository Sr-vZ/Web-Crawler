const fs = require('fs')

const cheerio = require('cheerio')
const async = require('async')
const request = require('request').defaults({
    timeout: 0
})

tmp = JSON.parse(fs.readFileSync('mubi_movieList.json'));
movieURLS = []
for (i = 0; i < 417; i++) {
    movieURLS[i] = 'https://mubi.com/films?page=' + (i + 1) + '&sort=title'
}
// request.setTimeout(0)
var urls = ["http://example.com", "http://example.com", "htp://example.com"];

// urls_complete = JSON.parse(fs.readFileSync('urls_done.json'))

urls = movieURLS
i = 0
var data = [];
var urls_done = []
var calls = urls.map((url) => (cb) => {
    request(url, (error, response, body) => {
        if (error) {
            console.error("We've encountered an error:", error);
            return cb();
        }
        urls_done.push(url)
        $ = cheerio.load(body)
        console.log(i++ + ' of ' + movieURLS.length + ' ' + url)

        // fs.appendFileSync('dump.json', JSON.stringify(html))
        // fs.appendFileSync('dump_response.json', JSON.stringify(response))
        jsonData = []


        // data = $('.film-tile')
        jsonData = []
        imgSrc = ''
        
        $('.film-tile').each(function(i, elm) {
            if ($(this).find('.film-thumb'))
                imgSrc = $(this).find('.film-thumb').src

            jsonData.push({
                movieTitle: $(this).find('.film-title').innerText,
                movieLink: $(this).find('.film-link').href,
                movieImg: imgSrc
            })







        })
        data = data.concat(jsonData)
    })
})

async.parallel(calls, () => {
    /* YOUR CODE HERE */
    fs.writeFileSync('movies_list.json', JSON.stringify(data))
    fs.appendFileSync('urls_done.json',JSON.stringify(urls_done))
})