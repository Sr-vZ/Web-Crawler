const fs = require("fs");

data = JSON.parse(fs.readFileSync('movies_api.json'))

jsonData = []

// release_year = 0
// cast = []
// director = ''
// language = ''
// duration = 0

console.log(data.movies.length)

for (i = 0; i < data.movies.length; i++) {

    console.log(i + ' of ' + data.movies.length + ' movie: ' + data.movies[i].title)
    cast = []
    for (j = 0; j < data.movies[i].castMembers.all.length; j++) {
        cast.push({
            name: data.movies[i].castMembers.all[j].name,
            image_link: ''
        })
    }

    title = data.movies[i].title
    language = data.movies[i].language.name
    release_year = data.movies[i].year
    link = data.movies[i].links.detail
    imgLink = data.movies[i].images.boxArt
    duration = data.movies[i].duration.seconds
    synopsis = data.movies[i].description.long
    director = data.movies[i].director.name

    jsonData.push({
        // anime_name: anime_name, // String | For anime name,
        title: title, //String | For episode title,
        language: language, //String | For language of this anime,
        // episode_number: (j + 1), //Integer | For episode number
        // season_name: 'Season ' + (s + 1), //String | Should be formatted like Season 1, Season 2.
        // release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
        release_year: release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
        synopsis: synopsis, //String | Episode synopsis
        link: 'https://www.shudder.com' + link, //String | Episode link
        // anime_link: anime_link, //String | If anime link is different then episode link.
        video_length: duration, //Integer | In seconds. Always convert the episode length to time in seconds.
        image_link: imgLink, //String | episode image link.
        stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
        // directors: directors //Array of string | If multiple director names available.
        director: director //String | If only one director name is available.
    })
}

fs.writeFileSync('shudder_movies.json', JSON.stringify(jsonData, null, 2))