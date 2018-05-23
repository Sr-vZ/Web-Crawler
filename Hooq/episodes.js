const fs = require("fs");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: true,
  //cookiesFiles: "./cookie.txt"
  webPreferences: {
    partition: "persist: testing"
  }
});
vo = require("vo");

var obj = JSON.parse(fs.readFileSync("tv_data.json"));

console.log(obj[1][0].seasons);
tvURLs = [];

for (i = 0; i < obj.length; i++) {
  for (j = 0; j < obj[i][0].seasons.length; j++) {
    //https://www.hooq.tv/discover/title/70aaa5c8-29de-40b9-9bbd-3f82dd24d19f/season/2
     tvURLs.push("https://www.hooq.tv/discover/title/" + obj[i][0].id + "/season/"+obj[i][0].seasons[j]);
    //console.log(obj[i][j].id);
  }
}
console.dir(tvURLs);
