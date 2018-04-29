const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false
});
const fs = require("fs");
var async = require("async");

var urls = [
  'http://www.hungama.com/movie/the-perks-of-being-a-wallflower/28800664/',
  'http://www.hungama.com/movie/silver-lining-playbook/29283854/',
  'http://www.hungama.com/movie/empire-state/17985506/',
  "http://www.hungama.com/movie/the-hangover-part-3/2170359/",
  "http://www.hungama.com/movie/blue-valentine/17262486/",
  "http://www.hungama.com/movie/american-sniper/7454061/"
];

url = "http://www.hungama.com/movie/main-tera-hero/15061830/";
// for (i=0;i<urls.length;i++){
//     fetchDetails(urls[i]);
// }

nightmare
  .goto(url)
  //.type("#search_form_input_homepage", "github nightmare")
  //.click("#search_button_homepage")
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
        "release_date_formatted" : release_year,
        "genre" : genre,
        "language": lang

      });
      //console.log(data.toString());
      //return [document.querySelectorAll(".qtip-tooltip").mtitle];
      return jsonData;
    })
  .end()
  .then(function (data) {
      console.dir(data);
      fs.writeFileSync("hungama_data_test.json", JSON.stringify(data));
    }

  )
  .catch(error => {
    console.error("Search failed:", error);
  });