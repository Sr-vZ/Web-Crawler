const fs = require('fs')
var _ = require('lodash')

tmp = JSON.parse(fs.readFileSync('movie_id.json'));
movieURLS = [], titles = [], synopsiss = [], release_dates = [], release_years=[]
for (i = 0; i < tmp.length; i++) {
    movieURLS[i] = tmp[i].movieLink
    titles[i] = tmp[i].movieTitle
    // imgLinks[i] = tmp[i].movieImg
    synopsiss[i]=tmp[i].synopsis
    rel_dat = tmp[i].release_date
    if (rel_dat !== "") {

        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        t = rel_dat.split('-')
        release_date_formatted = t[2] + '-' + months[t[1] - 1] + '-' + t[0]
        release_year = parseInt(t[0])
    }
    release_dates[i] = release_date_formatted
    release_years[i] = release_year
}

movieURLS = _.uniq(movieURLS)

console.log(movieURLS.length)
uniqueLink = []
fs.readFile('direcTV_movi_con.json', function (err, data) {
    data = JSON.parse(data)
    console.log(data.length)
    for (i = 0; i < data.length; i++) {
        idx = _.indexOf(movieURLS, data[i].link)
        // data[i].image_link = imgLinks[idx]
        data[i].title = titles[idx]
        data[i].release_date_formatted = release_dates[idx]
        data[i].release_year = release_years[idx]
        data[i].synopsis = synopsiss[idx]
    }
    fs.writeFileSync('movie.json', JSON.stringify(data, null, 2))
})

// idx = _.indexOf(movieURLS, 'https://mubi.com/films/american-beach-house')
// console.log(idx)