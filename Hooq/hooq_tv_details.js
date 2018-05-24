var fs = require("fs");
var _ = require("lodash");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
    show: true,
    //cookiesFiles: "./cookie.txt"
    webPreferences: {
        partition: 'persist: testing'
    }
});
vo = require('vo'),
    nightmare2 = Nightmare();


// cookieJar = JSON.parse(fs.readFileSync('hooq_nmjs_cookie.json', 'utf8'))

// console.log(cookieJar)



url = "https://www.hooq.tv/catalog/073aeadb-6a8a-4743-8ac5-64903a84e94f?__sr=feed&amp";



url = "https://www.hooq.tv/verify/email?h=eyJvdHAiOiI1NTE0NjgiLCJoYXNoIjoiM2I2ZUlja2hzTkZsQnpPVFUwWGVSWHArWldVPSIsInNpZ25hdHVyZSI6IjE0MzVjM2QwMGY4ODM1ODEwYjhjMjc2NjE1ZWYyMmFjZDhjOTI0NmI3N2QxOTM3MWYxZmFmMDIyMDkwNTJhZGMiLCJlbWFpbCI6ImhvZ2F5b21lcGlAYjJieC5uZXQiLCJjb3VudHJ5IjoiSU4iLCJhY3Rpb24iOiJzaWdudXAifQ=="
url =
    "https://www.hooq.tv/catalog/073aeadb-6a8a-4743-8ac5-64903a84e94f?__sr=feed&amp"

jsonUrl = []
for (i = 0; i < 15; i++) {
    jsonUrl[i] = "https://www.hooq.tv/search?page=" + (i + 1) + "&size=18&scope=min%2Cimages&as=TVSHOW";
}

//https://www.hooq.tv/search?page=2&size=18&scope=min%2Cimages&as=TVSHOW
//hifa@aditus.info
//  url ="https://www.hooq.tv/verify/email?h=eyJvdHAiOiIwMDk4NTEiLCJoYXNoIjoiWnhJNWhWVzRQaFM1UVNGU0pTMXZFVHFBQWEwPSIsInNpZ25hdHVyZSI6IjAyMWU0MDU0MDliNmVhMzAwNzY5MDgyMjhiYjhhY2Q3MzVlYjU1ZDUzZTJiODI2ZGM0YmQ3MmE2NDVjMTRjNWQiLCJlbWFpbCI6ImRpYmVmb3dpc29Ac3RvcmlxYXguY29tIiwiY291bnRyeSI6IklOIiwiYWN0aW9uIjoic2lnbmluIn0=";
nightmare
  .useragent(
    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .goto(url)
  //.cookies.get()
  //.wait(".btn")
  //.click('.btn')
  //.wait("#email")
  //.type("#email", "dibefowiso@storiqax.com")
  //.click('#submit-button')
  .wait(2000)
  //.goto('https://www.hooq.tv/search?page=2&size=18&scope=min%2Cimages&as=MOVIE')
  .then(() => {
    // console.log(cookies)
    // fs.writeFileSync('hooq_nmjs_cookie',JSON.stringify(cookies))

    var run = function*() {
      //var jsonUrl = ['http://www.yahoo.com', 'http://example.com', 'http://w3c.org'];
      var response = [];
      jsonUrl = [];
      for (i = 0; i < 144; i++) {
        jsonUrl[i] = "https://www.hooq.tv/search?page=" + (i+1) + "&size=18&scope=min%2Cimages&as=MOVIE";
      }
      for (var i = 0; i < jsonUrl.length; i++) {
        var title = yield nightmare
          .goto(jsonUrl[i])
          .wait("body")
          .evaluate(() => {
            response.push(body);
            fs.appendFileSync("hooq_movie_dump.json", JSON.stringify(response));
          });
        //response.push(body);
      }
      return response;
    };

    vo(run)(function(err, res) {
      console.dir(res);
    });
  });


//https://www.hooq.tv/search?page=2&size=18&scope=min%2Cimages&as=TVSHOW
async function main() {
    response = []
    for (i = 0; i < 15; i++) {
        jsonUrl[i] = "https://www.hooq.tv/search?page=" + (i + 1) + "&size=18&scope=min%2Cimages&as=TVSHOW";
    }

    //   var nightmare = Nightmare({ show: true })

    for (let i = 0; i < jsonUrl.length; i++) {
        const url = jsonUrl[i];
        const title = await nightmare
            .useragent(
                "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
            .goto(url)
            .wait('body')
            .evaluate(() => {
                response = [];
                response.push(document.body.innerText);
                return response
            }).then(result => {
                data = JSON.parse(result).data
                
                    response.push(data);
                                
                fs.appendFileSync("hooq_tv_dump3.json",JSON.stringify(data))
                console.log(url);
            })

        //console.log(url);
    }
    fs.writeFileSync("hooq_tv_test.json",JSON.stringify(response));
    await nightmare.end()
}

main().catch(console.error)