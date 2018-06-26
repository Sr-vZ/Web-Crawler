const phantom = require('phantom');
const fs = require('fs')

movies = JSON.parse(fs.readFileSync('mubi_movieList.json'));
movieURLS = []
length = movies.length
length = 50
for (i = 0; i < length; i++) {
    movieURLS[i] = movies[i].movieLink
    // movies[i] = tmp[i]
}

mubiDB = [];
(async function () {
    const instance = await phantom.create(['--webdriver-loglevel=ERROR', '--load-images=no']);
    const page = await instance.createPage();
    // await page.on('onResourceRequested', function (requestData) {
    //     console.info('Requesting', requestData.url);
    // });

    const status = await page.open('https://stackoverflow.com/');
    // const content = await page.property('content');
    // console.log(content);

    for (i = 0; i < length ; i++) {
        movieURL = movies[i].movieLink
        title = movies[i].movieTitle
        imgLink = movies[i].movieImg

        console.log((i+1) + ' of ' + movieURLS.length + ' movie url: ' + movieURL)
        const status = await page.open(movieURLS[i])
        const movieDetails = await page.evaluate(function (title, imgLink){
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

        await page.open(castURL);

        var castDetails = await page.evaluate(function(){
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

        movieDetails.stars = castDetails

        mubiDB = mubiDB.concat(movieDetails)
    }

    fs.writeFileSync('mubi.json', JSON.stringify(mubiDB))
    await instance.exit();
})();