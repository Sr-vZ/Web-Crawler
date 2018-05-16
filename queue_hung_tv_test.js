const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false,
  waitTimeout: 10000
});
const fs = require("fs");


var _ = require("lodash");
//fs.readFile('hungama_links_temp.json');

var obj,
  temp = [],
  urls = [];

var obj = JSON.parse(fs.readFileSync("hungama_tv_testdata.json", "utf8"));
console.log(obj[0].episode_details[0].episode_url);

for (i = 0; i < obj.length; i++) {
  for (j = 0; j < obj[i].episode_details.length; j++) {
    urls.push(obj[i].episode_details[j].episode_url)
  }
}
// var obj = JSON.parse(fs.readFileSync('hungama_links_temp.json', 'utf8'));
//   for (i=0;i<obj.length;i++){
//     //onsole.log(obj[i].linkUrl);
//     temp.push(obj[i].linkUrl)
//     }
//     urls = _.uniq(temp);

// var objData = fs.readFileSync("hungama_tv_links.json", "utf8");
// //console.log(objData.toString());
// links = objData.split(",");
//console.log(links[0]);

// for (i = 0; i < links.length; i++) {
//   temp[i] = links[i].replace(/[]/g, "").trim();
// }

// temp = JSON.parse(links);

urls = _.uniq(urls);

var alldata = [],
  i = 0,
  totalUrl = urls.length;
urls
  .reduce(function(accumulator, url) {
    return accumulator.then(function(results) {
      return nightmare
        .goto(url)
        .wait(2000)
        .evaluate(() => {
          var jsonData = [],
            synopsis = "",
            starDetails = [],
            category = "";

          gist = document.querySelector(".subttl").innerHTML;
          release_year = gist.substring(0, gist.indexOf("&")).trim();
          genre = gist.substring(gist.indexOf("<br>") + 4).trim();
          temp = gist.replace(/&nbsp;/g, " ");
          lang = temp.substring(temp.indexOf(" "), temp.indexOf("\n")).trim();

          if (document.querySelectorAll(".tvs-cont") > 0)
            synopsis = document
              .querySelector(".shortfilm-cont")
              .querySelector("p").innerHTML;
          else synopsis = "";
          if (document.querySelectorAll(".cast") > 0) {
            stars = document
              .querySelector(".cast")
              .querySelectorAll("#pajax_a");
            starDetails = new Array();
            for (i = 0; i < stars.length; i++) {
              starDetails.push({
                name: stars[i].querySelector("a").title,
                image_link: stars[i].querySelector("a").href
              });
            }
          }
          if (document.querySelectorAll(".category") > 0) {
            category = document.querySelector(".category").innerHTML;
          } else {
            category = "";
          }

          jsonData.push({
            url: document.URL,
            title: document.querySelector(".ttl").innerHTML,
            image_link: document.querySelector(".mainImg").src,
            category: category,
            synopsis: synopsis,
            stars: starDetails,
            release_year: release_year,
            genre: genre,
            language: lang
          });
          //console.log(data.toString());
          //return [document.querySelectorAll(".qtip-tooltip").mtitle];
          return jsonData;
        })
        //.end()
        .then(function(data) {
          //console.log(data[0]);
          //console.log(new Date());
          i++;
          console.log(
            i + "/" + totalUrl + " Fetched " + url + " at " + new Date()
          );
          fs.appendFileSync("hungama_tv_dump1.json", JSON.stringify(data[0]));
          alldata.push(data[0]);
          return data;
        })
        .catch(error => {
          errorData = [];
          console.error("Search failed:", error);
          errorData.push({
            url: url
          });
          fs.appendFileSync(
            "hungama_tv_testerrors.json",
            JSON.stringify(errorData)
          );
        });
    });
  }, Promise.resolve([]))
  .then(function(results) {
    //console.dir(results);
    //nightmare.end();
    fs.appendFileSync("hungama_tv_testdata1.json", JSON.stringify(alldata));
    console.log(alldata);
    nightmare.end();
  });
