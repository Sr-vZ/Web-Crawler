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
//id = obj[0][0].url

for (i = 0; i < obj.length; i++) {
  id = obj[i][0].url.split('/')[4].replace('?__sr=feed','')
  for (j = 0; j < obj[i][0].seasons.length; j++) {
    //https://www.hooq.tv/discover/title/70aaa5c8-29de-40b9-9bbd-3f82dd24d19f/season/2
     tvURLs.push("https://www.hooq.tv/discover/title/" + id + "/season/"+obj[i][0].seasons[j]);
    //console.log(obj[i][j].id);
  }
}
console.dir(tvURLs.length);
alldata =[]
async function main() {
  response = [];
  for (let i = 0; i < tvURLs.length; i++) {
      const url = tvURLs[i]; //.replace(';autoplay=1','');
      const title = await nightmare
          .useragent(
              "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
          )
          .goto(url)
          .wait("body")
          .evaluate(() => {
              response = []
              response.push(document.body.innerText);
              return response;
          })
          .then(result => {
              alldata.push(result);
              fs.appendFileSync("episodes_dump.json", result);
              console.log(i + " of " + tvURLs.length + " " + url);
          })
          .catch(error => {
              console.error("Failed:", error);
          });

      //console.log(url);
  }
  fs.writeFileSync("episode_data.json", alldata);
  await nightmare.end();
}

main().catch(console.error);
