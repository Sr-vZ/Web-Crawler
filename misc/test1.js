var Nightmare = require('nightmare');
var vo = require('vo');

var links = [];
seasons = []
result = []
url = "http://www.hungama.com/tv-show/motorcycle-experience/20835799/";

vo(run)(function (err, result) {
    if (err) throw err;
});

function* run() {
    var nightmare = Nightmare({
        show: false
    })

    yield nightmare
        .goto(url)
        .wait('.ttl')

    seasons = yield nightmare.evaluate(function (seasons) {
        return document.querySelectorAll(".tvshow ")
    },seasons)
    .then(function (res) {
        console.log(res)
        seasons = res})
      
        for (var i = 0; i < seasons.length; i++) {
        yield nightmare
            .goto(url)
            .click(seasons[i].href)
            .wait(5000)
            .evaluate(() => {
                epObj = document.querySelector("#show_details").querySelectorAll("#pajax_a");

                for (j = 0; j < epObj.length; j++) {
                    episodes.push({
                        season: seasons[i].innerText,
                        // episode_name: ep_name,
                        // episode_url: ep_link
                        episode_name: epObj[j].title,
                        episode_url: epObj[j].href
                    });
                }
                jsonData.push({
                    "url": document.URL,
                    "title": document.querySelector(".ttl").innerHTML,
                    "episode_details": episodes
                })
                return jsonData
            })
            .then(function (data) {
            console.dir(data)
            console.log(data)
            fs.appendFileSync("test1.json", JSON.stringify(data[0]));
          })
          .catch(error => {
            console.error("Search failed:", error);
          });
    }
   

    
    console.log(seasons)
    console.log(result)

    yield nightmare.end()
}