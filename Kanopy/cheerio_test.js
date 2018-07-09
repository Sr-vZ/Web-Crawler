const fs = require("fs");
const cheerio = require('cheerio')

html = fs.readFileSync('movies.html')
url = 'http://www.kanopy.com'

const $ = cheerio.load(html)
jsonData = []
$('.ui.divided.items > .item').each(function (i, elem) {
    console.log(i + ' ' + $(this).find('.content > a').text())
    jsonData.push({
        movieTitle: $(this).find('.content > a').text(),
        movieLink: url + $(this).find('.content > a').attr('href'),
        movieImg: url + $(this).find('img').attr('src')
    })
})


fs.writeFileSync('kanopy_movieList.json', JSON.stringify(jsonData, null, 2))