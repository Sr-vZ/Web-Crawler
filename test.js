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

nightmare
    .goto(url)
    //.type("#search_form_input_homepage", "github nightmare")
    //.click("#search_button_homepage")
    .wait(20000)
    .evaluate(() => {
        var jsonData = [],
            epObj = [],
            episodes = [];

        if (document.querySelectorAll(".song-name").length > 0)
            epObj = document.querySelectorAll(".song-name");

        console.debug(epObj);

        if (typeof epObj === "undefined") {
            episodes = [];
        } else {
            for (i = 0; epObj.length; i++) {
                ep_name = document
                  .querySelectorAll(".song-name")
                  [i].querySelector(".art-ttl").title;
                ep_link = document
                  .querySelectorAll(".song-name")
                  [i].querySelector(".art-ttl").href;
                episodes.push({
                    "episode_name" : ep_name,
                    "episode_url": ep_link
                });
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
        console.dir(data);
    })
    .catch(error => {
        console.error("Search failed:", error);
    });