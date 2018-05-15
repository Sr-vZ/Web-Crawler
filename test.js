var fs = require('fs');
var _ = require('lodash');
//fs.readFile('hungama_links_temp.json');


const Nightmare = require("nightmare");
const nightmare = Nightmare({
    show: false
});

var async = require("async");


var obj, temp = [],
    urls = [];
// fs.readFile('hungama_links_temp.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
//   for (i=0;i<obj.length;i++){
//     //onsole.log(obj[i].linkUrl);
//     if(_.includes(obj[i].linkUrl,'movie'))
//         temp.push(obj[i].linkUrl)
//     }
//     urls = _.uniq(temp);
//     //console.log(urls)
// });


var objData = fs.readFileSync("links_to process.txt", 'utf8');
//console.log(objData.toString());
links = objData.split('\n');
//console.log(links[1].trim().replace(/\"/g,"\'"));

//fs.writeFileSync('links_to_process.json',JSON.stringify(links))

// var obj = fs.readFileSync('hungama_tv_links.json','utf8')
// links = obj.split(',')
// for (i=0;i<links.length;i++){
//     console.log(links[i].trim())
// }
// console.log(links.length)
// x = JSON.parse(links);
// console.log(x[0])


var obj = JSON.parse(fs.readFileSync('hungama_tv_test3.json', 'utf8'))
console.log(obj[0].url)


url = obj[0].url

url = "http://www.hungama.com/tv-show/motorcycle-experience/20835799/";

nightmare
    .goto(url)
    //.type("#search_form_input_homepage", "github nightmare")
    //.click("#search_button_homepage")
    .wait('.ttl')
    .evaluate(() => {
        var jsonData = [],
            epObj = [],
            episodes = [];
        
        if (document.querySelectorAll(".tvshow ").length > 0) {
          seasons = document.querySelectorAll(".tvshow ");

          for (i = 0; i < seasons.length; i++){
            nightmare.click(seasons[i]) //seasons[i].click()
            if (document.querySelectorAll(".song-name").length > 0) 
                //epObj = document.querySelectorAll(".song-name");
                epObj = document
                  .querySelector("#show_details")
                  .querySelectorAll("#pajax_a");


            for (j = 0; j < epObj.length; j++) {
            //   ep_name = document
            //     .querySelectorAll(".song-name")
            //     [j].querySelector(".art-ttl").title;
            //   ep_link = document
            //     .querySelectorAll(".song-name")
            //     [j].querySelector(".art-ttl").href;
              episodes.push({
                season: seasons[i].innerText,
                // episode_name: ep_name,
                // episode_url: ep_link
                episode_name: epObj[j].title,
                episode_url: epObj[j].href
              });
            }
          }            
        }

        
        
        details = document.querySelector("#show_details");
        jsonData.push({
            "url": document.URL,
            "title": document.querySelector(".ttl").innerHTML,
            "episode_details": episodes
        });
        //console.log(data.toString());
        //return [document.querySelectorAll(".qtip-tooltip").mtitle];
        return jsonData;
    })
    .end()
    .then(function (data) {
        console.dir(data)
        console.log(data)
        fs.appendFileSync("test.json", JSON.stringify(data[0]));
    })
    .catch(error => {
        console.error("Search failed:", error);
    });

// var epLinks = JSON.parse(fs.readFileSync('hungama_tv_testdata.json','utf-8'))

// console.log(epLinks[0].episode_details[0].episode_url)

// for (i=0;i<epLinks.length;i++){
//     for(j=0;j<epLinks[i].episode_details.length;j++){
//         console.log(epLinks[i].episode_details[j].episode_url)
//     }
// }





var Nightmare = require('nightmare')

async function main() {
  var urls = [
    'http://example1.com',
    'http://example2.com',
    'http://example3.com'
  ]

  var nightmare = Nightmare({ show: true })

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const title = await nightmare
      .goto(url)
      .wait('body')
      .title()

    console.log(url, title)
  }

  await nightmare.end()
}

main().catch(console.error)
 