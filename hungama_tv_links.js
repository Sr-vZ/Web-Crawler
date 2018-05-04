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

//url = 'http://www.hungama.com/all/showcase-english-57/3039/';
url = 'http://www.hungama.com/all/showcase-hindi-57/3037/'
url = 'http://www.hungama.com/all/best-of-bbc-57/2175/'
url = 'http://www.hungama.com/all/showcase-comedy-57/2166/'
url = 'http://www.hungama.com/all/cookery-57/5292/'
url = 'http://www.hungama.com/tv-shows/english/'
url = 'http://www.hungama.com/all/hungama-picks-shows-58/4499/'
url = 'http://www.hungama.com/all/mathematical-tricks-58/5224/'
url = 'http://www.hungama.com/all/popular-shows-58/4500/'
url = 'http://www.hungama.com/all/world-of-wonder-58/2646/'
url = 'http://www.hungama.com/all/all-shows-58/5286/'

// nightmare
//   .goto(url)
//   .wait(".art-ttl")
//   .evaluate(() => {
//     var jsonData = [];
//     // stars = document
//     //   .querySelector(".art-carousal")
//     //   .querySelectorAll(".owl-item");
//     // starDetails = new Array();
//     // for (i = 0; i < stars.length; i++) {
//     //   starDetails.push({
//     //     name: stars[i].querySelector("a").title,
//     //     image_link: stars[i].querySelector("img").src
//     //   });
//     // }
//     // gist = document.querySelector(".subttl").innerHTML;
//     // release_year = gist.substring(0, gist.indexOf("&")).trim();
//     // genre = gist.substring(gist.indexOf("<br>") + 4).trim();
//     // temp = gist.replace(/&nbsp;/g, " ");
//     // lang = temp.substring(temp.indexOf(" "), temp.indexOf("\n")).trim();
//     // jsonData.push({
//     //   url: document.URL,
//     //   title: document.querySelector(".ttl").innerHTML,
//     //   image_link: document.querySelector(".mainImg").src,
//     //   category: document.querySelector(".category").innerHTML,
//     //   synopsis: document.querySelector(".shortfilm-cont").querySelector("p")
//     //     .innerHTML,
//     //   stars: starDetails,
//     //   release_year: release_year,
//     //   genre: genre,
//     //   language: lang
//     // });
//     // //console.log(data.toString());
//     // //return [document.querySelectorAll(".qtip-tooltip").mtitle];
//     // return jsonData;
//     data = document.querySelectorAll('.art-ttl');
//     tv_links=[];
//     for(i=0;i<data.length;i++){
//       tv_links[i]=data[i].href;
//     }
//     return tv_links
//   })
//   .end()
//   .then(function(data) {
//     console.dir(data);
//     fs.appendFileSync("hungama_tv_links.json", JSON.stringify(data));
//   })
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
      data = document.querySelectorAll('.art-ttl');
      tv_links = [];
      for (i = 0; i < data.length; i++) {
        tv_links[i] = data[i].href;
      }
      return tv_links
    })
    .end()
    .then(function (data) {
      console.dir(data);
      fs.appendFileSync("hungama_tv_links.json", JSON.stringify(data));
    })

};

vo(run)(function (err) {
  console.dir(err);
  console.log('done');
});