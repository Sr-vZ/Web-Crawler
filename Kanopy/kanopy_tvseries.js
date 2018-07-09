const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require('cheerio')



url = 'http://www.kanopy.com/catalog/movies/tv-series';


html=[]
(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);
    var pages = await page.evaluate(() => {
        p = document.querySelector('.ui.pagination.inverted.menu').querySelectorAll('.do-search.item')
        return parseInt(p[p.length - 1].innerText)
    })
    // pages = 2 //for test run
    console.log('total pages: ' + pages)

    for (i = 0; i < pages; i++) {
        // http://www.kanopy.com/catalog/movies-tv?space=videos&sm_vid_3=%22Movies%22&page=1&rows=20&sort=most-popular
        // http://www.kanopy.com/s/search?space=videos&sm_vid_3=%22Movies%22&sort=most-popular&page=2&rows=20
        pagedURL = 'http://www.kanopy.com/s/search?space=videos&sm_vid_3=%22Movies%22&sort=most-popular&page=' + i + '&rows=20'

        await page.goto(pagedURL);


        await page.waitForSelector("body");


        console.log(i + ' of ' + pages + ' pagedURL: ' + pagedURL)

        var movieDetails = await page.evaluate(() => {
            // cheerio = require('cheerio')
            // data = document.querySelector('.ui.divided.items').querySelectorAll('.item')
            jsonData = []
            imgSrc = ''
            
            data = JSON.parse(document.querySelector('pre').innerText)
            
            return data.results
        })
        movies = movies.concat(movieDetails)
    }
    const $ = cheerio.load(html)
    jsonData = []
    kanopyURL = 'http://www.kanopy.com'

    $('.ui.divided.items > .item').each(function (i, elem) {
        console.log(i + ' ' + $(this).find('.content > a').text())
        jsonData.push({
            movieTitle: $(this).find('.content > a').text(),
            movieLink: kanopyURL + $(this).find('.content > a').attr('href'),
            movieImg: kanopyURL + $(this).find('img').attr('src')
        })
    })
    
    fs.writeFileSync('kanopy_seriesList.json', JSON.stringify(jsonData, null, 2))

        temp = JSON.parse(fs.readFileSync('kanopy_movieList.json'))

        movieURLS = []
        kanopyDB = []
        movieLinks = []
        for (i = 0; i < temp.length; i++) {
            movieURLS[i] = temp[i].movieLink
            movieLinks[i] = temp[i].movieLink
        }

    for (i = 0; i < movieLinks.length; i++) {
        movieURL = movieLinks[i]
        // title = movies[i].movieTitle
        imgLink = temp[i].imgLink
        title = temp[i].title

        await page.goto(movieURL);
        
        await page.waitForSelector('body');
        
        console.log(i + ' of ' + movieLinks.length + ' movie url: ' + movieURL)

        var movieDetails = await page.evaluate((imgLink, title) => {
            jsonData = []

            release_year = 0
            cast = []
            director = ''
            language = ''
            duration = 0

            if (document.querySelector('.ui.grid.features')) {
                if (document.querySelector('.ui.grid.features').querySelectorAll('.five.wide.column') && document.querySelector('.ui.grid.features').querySelectorAll('.eleven.wide.column') ){
                    tags = document.querySelector('.ui.grid.features').querySelectorAll('.five.wide.column')
                    values = document.querySelector('.ui.grid.features').querySelectorAll('.eleven.wide.column')
                    for(t=0;t<tags.length;t++){
                        if (tags[t].innerText ==='Features'){
                            temp = values[t].innerText.split(', ')
                            for (c = 0; c < temp.length; c++) {
                                cast.push({
                                    name: temp[c].trim(),
                                    image_link: ''
                                })
                            }
                        }
                        if (tags[t].innerText === 'Filmmakers'){
                            director = values[t].innerText
                        }
                        if (tags[t].innerText === 'Languages'){
                            language = values[t].innerText
                        }
                        if (tags[t].innerText === 'Year'){
                            release_year = parseInt(values[t].innerText)
                        }
                        if (tags[t].innerText === 'Running Time') {
                            duration = parseInt(values[t].innerText.replace('mins',''))*60
                        }
                    }
                }
            
                
            }
            
            
            if (document.querySelector('.product-body'))
                synopsis = document.querySelector('.product-body').innerText
            
            
            jsonData.push({
                // anime_name: anime_name, // String | For anime name,
                title: title, //String | For episode title,
                language: '', //String | For language of this anime,
                // episode_number: (j + 1), //Integer | For episode number
                // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                // release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                synopsis: synopsis, //String | Episode synopsis
                link: document.URL, //String | Episode link
                // anime_link: anime_link, //String | If anime link is different then episode link.
                video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                image_link: imgLink, //String | episode image link.
                stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                // directors: directors //Array of string | If multiple director names available.
                director: director //String | If only one director name is available.
            })
            return jsonData
        }, imgLink, title)






        kanopyDB = kanopyDB.concat(movieDetails)
    }

        fs.writeFileSync('kanopy_movies.json', JSON.stringify(kanopyDB, null, 2))
    await browser.close();
})();




