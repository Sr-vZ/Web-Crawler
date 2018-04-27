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


// for (i=0;i<urls.length;i++){
//     fetchDetails(urls[i]);
// }

function fetchDetails(url) {


  nightmare
    .goto(url)
    //.type("#search_form_input_homepage", "github nightmare")
    //.click("#search_button_homepage")
    .wait('.ttl')
    .evaluate(
      () => {
        var jsonData = [];
        jsonData.push({
          "title": document.querySelector('.ttl').innerHTML,
          "image_link": document.querySelector('.mainImg').src,
          "category": document.querySelector('.category').innerHTML,
          "synopsis": document.querySelector('.shortfilm-cont').querySelector('p').innerHTML
        });
        //console.log(data.toString());
        //return [document.querySelectorAll(".qtip-tooltip").mtitle];
        return jsonData;
      })
    .end()
    .then(function (data) {
        console.log(data);
        fs.writeFileSync("hungama_data.json", JSON.stringify(data));
      }

    )
    .catch(error => {
      console.error("Search failed:", error);
    });
}

//Creates the authenticated nightmare instance

var scraper = new Nightmare({show: false});
// .goto('https://www.example.com/signin')
// .type('#login', 'username')
// .type('#password', 'password')
// .click('#btn')
// .run(function(err, nightmare) {
//   if (err) {
//     console.log(err);
//   }
//   console.log('Done.');
// });

//Trying to use async module to iterate through urls

function load(url, callback) {
  scraper
    .goto(url)
    .wait('.ttl')
    .evaluate(
      () => {
        var jsonData = [];
        jsonData.push({
          "title": document.querySelector('.ttl').innerHTML,
          "image_link": document.querySelector('.mainImg').src,
          "category": document.querySelector('.category').innerHTML,
          "synopsis": document.querySelector('.shortfilm-cont').querySelector('p').innerHTML
        });
        //console.log(data.toString());
        //return [document.querySelectorAll(".qtip-tooltip").mtitle];
        return jsonData;
      })
    //.end()
    .run(function(err, nightmare) {
      if (err) {
        console.log(err);
      }
      
      console.log('Done with ', url);
      
      callback()
    })
    .then(function (data) {
        console.log(data);
        fs.writeFileSync("hungama_data.json", JSON.stringify(data));
      }
    )
    
    .catch(error => {
      console.error("Search failed:", error);
    })
    
}

async.eachSeries(urls, load, function (err) {
  console.log('done!');
});