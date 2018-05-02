
const Nightmare = require("nightmare");
const nightmare = Nightmare({show: false});
const fs = require("fs");

var urls = [
    'http://www.hungama.com/movie/the-perks-of-being-a-wallflower/28800664/',
    'http://www.hungama.com/movie/silver-lining-playbook/29283854/',
    'http://www.hungama.com/movie/empire-state/17985506/',
    "http://www.hungama.com/movie/the-hangover-part-3/2170359/",
    "http://www.hungama.com/movie/blue-valentine/17262486/",
    "http://www.hungama.com/movie/american-sniper/7454061/"
  ];

urls.reduce(function(accumulator, url) {
  return accumulator.then(function(results) {
    return nightmare.goto(url)
    .goto(url)
    .wait('.ttl')
    .evaluate(
      () => {
        var jsonData = [];
      stars = document.querySelector('.art-carousal').querySelectorAll('.owl-item');
      starDetails = new Array();
      for (i = 0; i < stars.length; i++) {
        starDetails.push({
          "name": stars[i].querySelector('a').title,
          "image_link": stars[i].querySelector('img').src
        })
      }
      gist = document.querySelector('.subttl').innerHTML;
      release_year = gist.substring(0,gist.indexOf('&')).trim();
      genre = gist.substring(gist.indexOf('<br>')+4).trim();
      temp = gist.replace(/&nbsp;/g,' ');
      lang = temp.substring(temp.indexOf(' '),temp.indexOf('\n')).trim();
      jsonData.push({
        "url": document.URL,
        "title": document.querySelector('.ttl').innerHTML,
        "image_link": document.querySelector('.mainImg').src,
        "category": document.querySelector('.category').innerHTML,
        "synopsis": document.querySelector('.shortfilm-cont').querySelector('p').innerHTML,
        "stars": starDetails,
        "release_year" : release_year,
        "genre" : genre,
        "language": lang

      });
      //console.log(data.toString());
      //return [document.querySelectorAll(".qtip-tooltip").mtitle];
      return jsonData;
      })
      .then(function (data) {
        console.log(data);
        console.log(new Date());
        console.log(url);
        fs.appendFileSync("hungama_data.json", JSON.stringify(data));
        return data;
      })
      .catch(error => {
        console.error("Search failed:", error);
      });
  });
}, Promise.resolve([])).then(function(results){
    console.dir(results);
    //nightmare.end();
});