const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')


url = 'https://api.yuppflix.com/yupptv/yuppflix/api/v1/movies/list?sort=&genres=&country=IN&lang=All&count=100000&last_index=-1&sections=All';

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Host': 'api.yuppflix.com',
        'Origin': 'https://www.yuppflix.com',
        'Referer': 'https://www.yuppflix.com/movies',
        'session-id': 'YF-f5697e08-5a17-4005-9933-db0f6deb8ff1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36',
        'Content-Type': 'application/json',
        'box-id': 'c98a90f2-f648-a864-ba13-6881f2eda3f0'
    });

    // await page.goto(url);
    // await page.waitForSelector('body')

    // const movieData = await page.evaluate(() => {
    //     jsonData = []
    //     data =  JSON.parse(document.querySelector('pre').innerText)

    //     for (i = 0; i < data.movies.length; i++) {
    //         release_date= new Date(data.movies[i].releaseDate)
    //         jsonData.push({
    //             "movietitle": data.movies[i].name,
    //             "image_link": data.movies[i].backgroundImage,
    //             "director": '',
    //             "release_year": release_date.getFullYear() ,
    //             "release_date_formatted": release_date.toISOString(),
    //             "video_length": "",
    //             "decsription": "",
    //             "genre": "",
    //             "stars": [],
    //             "language": data.movies[i].language,
    //             "url": 'https://www.yuppflix.com/movies/watch/'+data.movies[i].code
    //         })
    //     }
    //     return jsonData
    // })
    // console.log(movieData)
    // fs.writeFileSync('yupp_movies.json', JSON.stringify(movieData))
    //movies details url https://api.yuppflix.com/yupptv/yuppflix/api/v1/movies/movie/details?code=bhaagamathie&country=IN&lang=All

    var movieData = JSON.parse(fs.readFileSync('yupp_movies.json'))
    console.log(movieData[0].url)
    var movieDetails = []
    for (i = 0; i < movieData.length; i++) {
        movieCode = movieData[i].url.split("/")[movieData[i].url.split("/").length - 1];
        detailsURL = 'https://api.yuppflix.com/yupptv/yuppflix/api/v1/movies/movie/details?code=' + movieCode + '&country=IN&lang=All'
        console.log('url '+(i+1)+' of '+movieData.length +' :'+detailsURL)
        await page.goto(detailsURL)
        await page.waitForSelector('body')
        const mDetails = await page.evaluate(() => {
            jsonData = [];
            data = JSON.parse(document.querySelector("pre").innerText);
            stars=[]
            temp = data.response.movieDetails.newCastCrew;
            for(j=0;j<temp.length;j++){
                if(temp[j].role ==='Actor'){
                    stars.push({
                      name: temp[j].name,
                      image_link: temp[j].iconUrl
                    });
                }
            }

            jsonData.push({
              director:
                data.response.movieDetails.castCrew.director,

              video_length: data.response.movieDetails.duration,
              decsription: data.response.movieDetails.description,
              genre: data.response.movieDetails.genre,
              stars: stars,

              url:
                "https://www.yuppflix.com/movies/watch/" +
                data.response.movieDetails.code
            });
            
            return jsonData
        })
        movieDetails.push(mDetails)
    }

    for(i=0;i<movieData.length;i++){
        movieData[i].director = movieDetails[i][0].director
        movieData[i].video_length = movieDetails[i][0].video_length
        movieData[i].decsription = movieDetails[i][0].description
        movieData[i].genre = movieDetails[i][0].genre
        movieData[i].stars = movieDetails[i][0].stars
    }
    console.log(movieData)
    fs.writeFileSync('yupp_movies1.json', JSON.stringify(movieData))
    await browser.close()
})()