const puppeteer = require('puppeteer');
const _ = require('lodash')
const fs = require('fs')


url =
    "https://api.yuppflix.com/yupptv/yuppflix/api/v1/tvshows/list?lang=All&count=10000&genres=&sort=latest&last_index=-1&sections=All";

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Host': 'api.yuppflix.com',
        'Origin': 'https://www.yuppflix.com',
        'Referer': 'https://www.yuppflix.com/movies',
        'session-id': 'YF-060e4f6e-b4c8-4de4-8451-10fce9b184cd',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36',
        'Content-Type': 'application/json',
        'box-id': '4b187b6c-6d57-0227-fed2-793c7e6bac9c'
    });

    await page.goto(url);
    await page.waitForSelector('body')

    var seriesData = await page.evaluate(() => {
        jsonData = []
        data = JSON.parse(document.querySelector('pre').innerText)

        for (i = 0; i < data.shows.length; i++) {
            release_date = new Date(data.shows[i].telecastDate);
            jsonData.push({ // seriestitle: data.shows[i].name,
                image_link: data.shows[i].backgroundImage,
                director: "",
                release_year: release_date.getFullYear(),
                release_date_formatted: release_date.toISOString(),
                video_length: "",
                decsription: "",
                genre: "",
                stars: [],
                language: data.shows[i].language,
                url: "https://www.yuppflix.com/tvshows/watch/" + data.shows[i].code,
                id: data.shows[i].id,
                series_name: data.shows[i].name,
                season_name: "",
                episode_number: "",
                title: "",
                code: data.shows[i].code
            });
        }
        return jsonData
    })
    console.log(seriesData)
    fs.writeFileSync('yupp_series.json', JSON.stringify(seriesData))
    //movies details url https://api.yuppflix.com/yupptv/yuppflix/api/v1/movies/movie/details?code=bhaagamathie&country=IN&lang=All

    seriesData = JSON.parse(fs.readFileSync('yupp_series.json'))
    console.log(seriesData[0].url)
    var movieDetails = []
    for (i = 0; i < seriesData.length; i++) {
        tvshowCode = seriesData[i].code;
        seriesURL=seriesData[i].url
        detailsURL = "https://api.yuppflix.com/yupptv/yuppflix/api/v2/tvshows/tvshow/details?code=" + tvshowCode + "&episode_count=1000";
        // https://api.yuppflix.com/yupptv/yuppflix/api/v2/tvshows/tvshow/episodes?tvshow_id=508556&season_id=64&last_index=11&count=12
        // https://api.yuppflix.com/yupptv/yuppflix/api/v2/tvshows/tvshow/details?code=hey-krishna&episode_count=12
        console.log('url ' + (i + 1) + ' of ' + seriesData.length + ' :' + detailsURL)
        await page.goto(detailsURL)
        await page.waitForSelector('body')
        const mDetails = await page.evaluate((seriesURL) => {
            jsonData = [];
            allEpisodes = []
            data = JSON.parse(document.querySelector("pre").innerText);
            stars = []
            // temp = data.response.selectedSeasonEpisodes.newCastCrew;
            // for(j=0;j<temp.length;j++){
            //     if(temp[j].role ==='Actor'){
            //         stars.push({
            //           name: temp[j].name,
            //           image_link: temp[j].iconUrl
            //         });
            //     }
            // }
            for (j = 0; j < data.response.selectedSeasonEpisodes.episodes.length; j++) {
                release_date = new Date(data.response.selectedSeasonEpisodes.episodes[j].telecastDate);
                months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                jsonData.push({
                    image_link: data.response.selectedSeasonEpisodes.episodes[j]
                        .iconUrl,
                    director: "",
                    release_year: release_date.getFullYear(),
                    release_date_formatted: release_date.getDate() + '-' + months[release_date.getMonth()] + '-' + release_date.getFullYear(),
                    video_length: "",
                    synopsis: data.response.selectedSeasonEpisodes.episodes[j].description,
                    genre: data.response.selectedSeasonEpisodes.episodes[j].genre,
                    stars: [],
                    language: data.response.selectedSeasonEpisodes.episodes[j].language,
                    //   id: data.shows[i].id,
                    series_name: data.response.selectedSeasonEpisodes.episodes[j].tvShowName,
                    season_name: "Season " + data.response.selectedSeasonEpisodes.episodes[j].seasonNumber,
                    episode_number: j + 1,
                    title: data.response.selectedSeasonEpisodes.episodes[j].name,
                    link:seriesURL
                });
                //   allEpisodes.push(jsonData);

            }


            return jsonData
        },seriesURL)
        // movieDetails.push(mDetails)
        console.log(mDetails)
        fs.appendFileSync("yupp_episodes.json", JSON.stringify(mDetails));
    }

    // for (i = 0; i < seriesData.length; i++) {
    //     seriesData[i].director = movieDetails[i][0].director
    //     seriesData[i].video_length = movieDetails[i][0].video_length
    //     seriesData[i].decsription = movieDetails[i][0].description
    //     seriesData[i].genre = movieDetails[i][0].genre
    //     seriesData[i].stars = movieDetails[i][0].stars
    // }
    console.log(movieDetails)
    // fs.writeFileSync('yupp_episodes.json', JSON.stringify(movieDetails))
    await browser.close()
})()