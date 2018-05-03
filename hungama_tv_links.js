// core modules
var fs = require("fs");
var url = require("url");

// third party modules
var _ = require("lodash");
var async = require("async");
var cheerio = require("cheerio");
var request = require("request");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: true
});

url = 'http://www.hungama.com/all/showcase-english-57/3039/';

nightmare
  .goto(url)
  .wait(".art-ttl")
  .click(".load_more_button")
  .wait(2000)
  .click(".load_more_button")
  .evaluate(() => {
    var jsonData = [];
    // stars = document
    //   .querySelector(".art-carousal")
    //   .querySelectorAll(".owl-item");
    // starDetails = new Array();
    // for (i = 0; i < stars.length; i++) {
    //   starDetails.push({
    //     name: stars[i].querySelector("a").title,
    //     image_link: stars[i].querySelector("img").src
    //   });
    // }
    // gist = document.querySelector(".subttl").innerHTML;
    // release_year = gist.substring(0, gist.indexOf("&")).trim();
    // genre = gist.substring(gist.indexOf("<br>") + 4).trim();
    // temp = gist.replace(/&nbsp;/g, " ");
    // lang = temp.substring(temp.indexOf(" "), temp.indexOf("\n")).trim();
    // jsonData.push({
    //   url: document.URL,
    //   title: document.querySelector(".ttl").innerHTML,
    //   image_link: document.querySelector(".mainImg").src,
    //   category: document.querySelector(".category").innerHTML,
    //   synopsis: document.querySelector(".shortfilm-cont").querySelector("p")
    //     .innerHTML,
    //   stars: starDetails,
    //   release_year: release_year,
    //   genre: genre,
    //   language: lang
    // });
    // //console.log(data.toString());
    // //return [document.querySelectorAll(".qtip-tooltip").mtitle];
    // return jsonData;
  })
  .end()
  .then(function(data) {
    console.dir(data);
    fs.writeFileSync("hungama_data_test.json", JSON.stringify(data));
  })
  .catch(error => {
    console.error("Search failed:", error);
  });



