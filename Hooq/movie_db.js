const fs = require('fs')
var _ = require('lodash')


var obj = JSON.parse(fs.readFileSync('hooq_movies.json'))

console.log(obj[6].url)


var castDetails = JSON.parse(fs.readFileSync("hooq_movie_cast.json"));

console.log(castDetails[6][0].stars)
//idx = _.find(castDetails,["url", obj[6].url])

console.log(castDetails.length)
console.log(obj.length)

movieDb =[]
for(i=0;i<obj.length;i++){
    //idx = _.findIndex(castDetails,["url",obj[i].url])


    movieDb.push({
      category: "",
      genre: castDetails[i][0].genre,
      age_rating: obj[i].age_rating,
      image_link: obj[i].image_link,
      language: castDetails[i][0].lang,
      release_year: obj[i].release_year,
      stars: castDetails[i][0].stars,
      synopsis:obj[i].synopsis,
      length: obj[i].length,
      title: obj[i].title,
      url:obj[i].url,
      director : castDetails[i][0].director
    });
console.log(movieDb[i])
}

fs.writeFileSync('hooq_movie_data.json',JSON.stringify(movieDb))