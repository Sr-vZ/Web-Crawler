const fs = require('fs')
// const request = require('request')
const puppeteer = require("puppeteer");


erosAPI = 'https://erosnow.com/v2/catalog/movies?content_type_id=1&language=hin&start_index=1&max_result=100&cc=IN'
maxMovie = 100 // api single request limit
erosDB = []
totalMovies = 0;

(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(erosAPI);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);
    // const jsonOutput = await page.evaluate(() => {
    //     data = JSON.parse(document.querySelector('pre').innerText)

    //     return data
    // })
    var totalMovies = await page.evaluate(() => {
        data = JSON.parse(document.querySelector('body').innerText)
        return parseInt(data.total)
    })
    console.log('Total no. of Movies: ', totalMovies)
    fetchRounds = Math.ceil(totalMovies / maxMovie)
    fetchURLS = []
    for (i = 0; i < fetchRounds; i++) {
        fetchURLS[i] = 'https://erosnow.com/v2/catalog/movies?content_type_id=1&language=hin&start_index=' + (i * 100 + 1) + '&max_result=100&cc=IN'
    }
    console.log(fetchURLS)

    for (i = 0; i < fetchURLS.length; i++) {
        // for (i = 0; i < 20; i++) {


        fetchURL = fetchURLS[i]
        console.log(i + ' of ' + fetchURLS.length + ' : ' + fetchURL)
        await page.goto(fetchURL)
        await page.waitForSelector('body');
        var movieDetails = await page.evaluate(() => {
            jsonData = []
            data = JSON.parse(document.querySelector('body').innerText)
            for (m = 0; m < data.rows.length; m++) {
                free = true
                if (data.rows[m].free === "NO") {
                    free = false
                }
                movie_url='https://erosnow.com/movie/watch/'+data.rows[m].asset_id+'/'+data.rows[m].title.toLowerCase().replace(/ /g,'-').replace('&','and')

                jsonData.push({
                    title: data.rows[m].title,
                    link: movie_url,
                    is_free: free
                })
            }
    
            return jsonData
        })
        console.log(movieDetails)
        erosDB = erosDB.concat(movieDetails)

        

    }



    fs.writeFileSync('erosMovies.json', JSON.stringify(erosDB, null, 2))
    await browser.close();
})();