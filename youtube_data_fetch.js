// core modules
var fs = require("fs");
var url = require("url");

// third party modules
var _ = require("lodash");
var async = require("async");
var cheerio = require("cheerio");
var request = require("request");
var vo = require('vo');


const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false
});


// {videos: [{channel_link, image_link, link, heading, video_length, date_published, description}]}

url = 'https://www.youtube.com/channel/UCNJcSUSzUeFm8W9P7UUlSeQ/videos' //tvf link

links = JSON.parse(fs.readFileSync('youtube_tvf_links.json','utf-8'))

//console.log(links)

//url =links[0]
console.log(url)

// nightmare
//   .goto(url)
//   //.type("#search_form_input_homepage", "github nightmare")
//   //.click("#search_button_homepage")
//   .wait('.ttl')
//   .evaluate(
//     () => {
//       var jsonData = [];
//       stars = document.querySelector('.art-carousal').querySelectorAll('.owl-item');
//       starDetails = new Array();
//       for (i = 0; i < stars.length; i++) {
//         starDetails.push({
//           "name": stars[i].querySelector('a').title,
//           "image_link": stars[i].querySelector('img').src
//         })
//       }
//       gist = document.querySelector('.subttl').innerHTML;
//       release_year = gist.substring(0,gist.indexOf('&')).trim();
//       genre = gist.substring(gist.indexOf('<br>')+4).trim();
//       temp = gist.replace(/&nbsp;/g,' ');
//       lang = temp.substring(temp.indexOf(' '),temp.indexOf('\n')).trim();
//       jsonData.push({
//         "url": document.URL,
//         "title": document.querySelector('.ttl').innerHTML,
//         "image_link": document.querySelector('.mainImg').src,
//         "category": document.querySelector('.category').innerHTML,
//         "synopsis": document.querySelector('.shortfilm-cont').querySelector('p').innerHTML,
//         "stars": starDetails,
//         "release_year" : release_year,
//         "genre" : genre,
//         "language": lang

//       });
//       //console.log(data.toString());
//       //return [document.querySelectorAll(".qtip-tooltip").mtitle];
//       return jsonData;
//     })
//   .end()
//   .then(function (data) {
//       console.dir(data);
//       fs.writeFileSync("hungama_data_test.json", JSON.stringify(data));
//     }

//   )
//   .catch(error => {
//     console.error("Search failed:", error);
//   });

var run = function* () {
    yield nightmare.goto(url);
  
    var previousHeight, currentHeight = 0;
    while (previousHeight !== currentHeight) {
      previousHeight = currentHeight;
      var currentHeight = yield nightmare.evaluate(function () {
        return document.body.scrollHeight;
      });
      yield nightmare.scrollTo(currentHeight, 0)
        .wait(3000);
    }
    yield nightmare
      .evaluate(() => {
        data = document.querySelectorAll('#dismissable');
        jsonData = [];
        for (i = 0; i < data.length; i++) {
          jsonData.push({
              "channel_link": data[i].URL,
              "image_link" : data[i].querySelector('img').src,
              "link" : data[i].querySelector('#video-title').href,
              "heading" : data[i].querySelector('#video-title').title,
              "video_length" : data[i].querySelector('#overlays').innerText.trim(),
              "date_published" : data[i].querySelector('#metadata-line').innerText.trim().split('\n')[1],
              "description" : ''
          })
        }
        return jsonData
      })
      .end()
      .then(function (data) {
        console.dir(data);
        fs.appendFileSync("youtube_tvf_dump.json", JSON.stringify(data));
      })
  
  };
  
  vo(run)(function (err) {
    console.dir(err);
    console.log('done');
  });