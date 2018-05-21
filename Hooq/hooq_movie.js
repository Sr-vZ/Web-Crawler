const fs = require('fs')
const _  = require('lodash')
const cheerio = require('cheerio')

var obj = JSON.parse(fs.readFileSync("collections_movie.json"));

//console.log(obj.collections[13].attributes.titles.length)



html = fs.readFileSync('hooq.html')
var $ = cheerio.load(html);

total = 0
hooqMovie = []
for (i=0;i<obj.collections.length;i++){
    for(j=0;j<obj.collections[i].attributes.titles.length;j++){
    console.log(obj.collections[i].attributes.titles[j].title);
    total++
    hooqMovie.push({
      category: "",
      genre: "",
      age_rating: obj.collections[i].attributes.titles[j].meta.ageRating,
      //image_link: obj.collections[i].attributes.titles[j].images[2].url,
      language: "",
      release_year:
        obj.collections[i].attributes.titles[j].meta.releaseYear,
      stars: [],
      synopsis: obj.collections[i].attributes.titles[j].short_description,
      length: obj.collections[i].attributes.titles[j].running_time_player,
      title: obj.collections[i].attributes.titles[j].title,
      url:
        "www.hooq.tv/catalog/" +
        obj.collections[i].attributes.titles[j].id +
        "?__sr=feed&amp;autoplay=1"
    });


    }
}
console.log(total)
console.dir(hooqMovie)

fs.writeFileSync('hooq_movies.json',JSON.stringify(hooqMovie))