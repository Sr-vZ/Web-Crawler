const fs = require('fs')

data = []
fs.readFile('spuul_api3.json', function (fdata) {
    data = JSON.parse(fdata)
    console.log(data)
})

fdata = fs.readFileSync('spuul_api3.json')
data = JSON.parse(fdata)

console.log(data.length)

jsonData = []
for (i = 0; i < data.length; i++) {
    cast = []
    tmp = data[i].actors.split(', ')
    for(c=0;c<tmp.length;c++){
        cast.push({
            name: tmp[c],
            image_link: ''
        })
    }
    console.log(i + ' of ' + data.length + ' :' + data[i].title)
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    release_date_formatted =''
    if(data[i].release_date){
        release_date_formatted = data[i].release_date.split('-')[2] + '-' + months[data[i].release_date.split('-')[1] - 1] + '-' + data[i].release_date.split('-')[0]
    }
    jsonData.push({
        // series_name: String | For series name
        title: data[i].title, //String | For episode title
        language: data[i].language, //String | For language of this series.
        // languages: Array of string | If multiple languages available use this instead of language.
        // episode_number: Integer | For episode number
        // season_name: String | Should be formatted like Season 1, Season 2.
        release_date_formatted: release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
        release_year: parseInt(data[i].production_year), //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
        synopsis: data[i].synopsis ,//String | Episode synopsis
        link: 'https://spuul.com' + data[i].permalink, //String | Episode link
        // series_link: String | If series link is different then episode link.
        video_length: data[i].length, //Integer | In seconds. Always convert the episode length to time in seconds.
        image_link: data[i].cover.large, //String | episode image link.
        stars: cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
        director: data[i].director, //String | If only one director name is available.
        // directors: Array of string | If multiple director names available.
    })
}

fs.writeFileSync('spuul_movies.json',JSON.stringify(jsonData,null,2))