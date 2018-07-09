const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require('cheerio')

url = 'http://www.kanopy.com/catalog/movies-tv';

let page

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)
    await page.goto(url);

    // await page.waitForSelector("body");
    await page.waitForSelector("body");

    var pages = await page.evaluate(() => {
        p = document.querySelector('.ui.pagination.inverted.menu').querySelectorAll('.do-search.item')
        return parseInt(p[p.length - 1].innerText)
    })
    // pages = 2 //for test run
    console.log('total pages: ' + pages)
    // pages = 2 //for test run

    movies = []
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
            // for (i = 0; i < data.length; i++) {
            //     if (data[i].querySelector('img'))
            //         imgSrc = data[i].querySelector('img').src
            //     if (data[i].querySelector('.content')) {
            //         title = data[i].querySelector('.content').querySelector('a').innerText
            //         link = data[i].querySelector('.content').querySelector('a').href
            data = JSON.parse(document.querySelector('pre').innerText)
            // const $ = cheerio.load(data.results)        
            // $('.item').each(function (i, elem) {
            //     jsonData.push({
            //         movieTitle: $(this).find('.content > a').text(),
            //         movieLink: $(this).find('.content > a').attr('href'),
            //         movieImg: $(this).find('img').attr('src')
            //     })   
            // })
                    // jsonData.push({
                    //     movieTitle: title,
                    //     movieLink: link,
                    //     movieImg: imgSrc
                    // })
                
            
            // return jsonData
            return data.results
        })
        movies = movies.concat(movieDetails)
    }
    const $ = cheerio.load(movies)
    jsonData = []        
            $('.item').each(function (i, elem) {
                jsonData.push({
                    movieTitle: $(this).find('.content > a').text(),
                    movieLink: $(this).find('.content > a').attr('href'),
                    movieImg: $(this).find('img').attr('src')
                })   
            })
    console.log('total movies: '+jsonData.length)
    fs.writeFileSync('movies.html',movies)
    fs.writeFileSync('kanopy_movieList.json', JSON.stringify(jsonData, null, 2))

    /*   mubiDB = []
       for (i = 0; i < movies.length; i++) {
           movieURL = movies[i].movieLink
           title = movies[i].movieTitle
           imgLink = movies[i].movieImg
           await page.goto(movieURL);
           
           await page.waitFor(1000);
           // page.waitForNavigation({
           //     waitUntil: 'domcontentloaded'
           // })
           console.log(i + ' of ' + movies.length + ' movie url: ' + movieURL)

           var movieDetails = await page.evaluate((title, imgLink) => {
               jsonData = []

               duration = 0;
               synopsis = ''
               directors = []
               release_year = 0
               if (document.querySelector('time'))
                   duration = parseInt(document.querySelector('time').innerText) * 60
               if (document.querySelector('.film-show__descriptions__synopsis').querySelector('p'))
                   synopsis = document.querySelector('.film-show__descriptions__synopsis').querySelector('p').innerText
               if (document.querySelector('.listed-directors'))
                   directors = document.querySelector('.listed-directors').innerText.split(',')
               if (document.querySelector('.film-show__country-year'))
                   release_year = parseInt(document.querySelector('.film-show__country-year').innerText.split(',')[document.querySelector('.film-show__country-year').innerText.split(',').length - 1])
               jsonData.push({
                   // anime_name: anime_name, // String | For anime name,
                   title: title, //String | For episode title,
                   // language: '', //String | For language of this anime,
                   // episode_number: (j + 1), //Integer | For episode number
                   // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
                   // release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
                   release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
                   synopsis: synopsis, //String | Episode synopsis
                   link: document.URL, //String | Episode link
                   // anime_link: anime_link, //String | If anime link is different then episode link.
                   video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
                   image_link: imgLink, //String | episode image link.
                   stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
                   directors: directors //Array of string | If multiple director names available.
               })
               return jsonData
           }, title, imgLink)

           castURL = movieURL + '/cast'
           await page.goto(castURL);
           
           await page.waitFor(1000);
           // page.waitForNavigation({
           //     waitUntil: 'domcontentloaded'
           // })
           var castDetails = await page.evaluate(() => {
               stars = []
               data = document.querySelectorAll('.cast_member')
               for (c = 0; c < data.length; c++) {
                   if (data[c].querySelector('.cast-member-media__subheader')) {
                       if (data[c].querySelector('.cast-member-media__subheader').innerText === 'CAST' || data[c].querySelector('.cast-member-media__subheader').innerText === 'SELF')
                           stars.push({
                               name: data[c].querySelector('.cast-member-media__header').innerText,
                               image_link: data[c].querySelector('img').src
                           })
                   }
               }
               return stars
           })

           movieDetails[0].stars = castDetails

           mubiDB = mubiDB.concat(movieDetails)
       }



       fs.writeFileSync('mubi.json', JSON.stringify(mubiDB)) */
    await browser.close();
})();