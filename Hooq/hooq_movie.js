const fs = require('fs')
const _  = require('lodash')
const cheerio = require('cheerio')

//var obj = JSON.parse(fs.readFileSync("collections_movie.json"));
var obj = JSON.parse(fs.readFileSync("hooq_movie_test.json"));
console.log(obj[143][0].id)
console.log(obj.length)
console.log(obj[0].length)
//console.log(obj[0])

total = 0
hooqMovie = []
for (i=0;i<obj.length;i++){
    for(j=0;j<obj[i].length;j++){
    console.log(obj[i][j].attributes.title);
    total++
    hooqMovie.push({
      category: "",
      genre: "",
      age_rating: obj[i][j].attributes.meta.ageRating,
      //image_link: obj[i].attributes.titles.images[2].url,
      language: "",
      release_year:
        obj[i][j].attributes.meta.releaseYear,
      stars: [],
      synopsis: obj[i][j].attributes.short_description,
      length: obj[i][j].attributes.running_time_player,
      title: obj[i][j].attributes.title,
      url:
        "https://www.hooq.tv/catalog/" +
        obj[i][j].attributes.id +
        "?__sr=feed&amp;autoplay=1"
    });


    }
}
console.log(total)
//console.dir(hooqMovie)

fs.writeFileSync('hooq_movies.json',JSON.stringify(hooqMovie))