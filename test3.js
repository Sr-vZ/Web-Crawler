
var fs = require("fs");
var _ = require("lodash");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false
});


url = "http://www.hungama.com/tv-show/motorcycle-experience/20835799/";


nightmare
  .goto(url)
  //.type("#search_form_input_homepage", "github nightmare")
  //.click("#search_button_homepage")
  .wait(5000)
  .evaluate(()=>{
      var x= []
      s = document.querySelectorAll('.tvshow')
      for(i=0;i<s.length;i++)
        x.push(s[i].title)
    
    return x
  })
  .then(function (res) {
      console.log(res)
      for(j=0;j<res.length;j++){
        season = res[j]
      return nightmare
        .click('a[title="' + res[j] + '"]')
        .wait("#show_details")
        .evaluate(() => {
          episodes = [];
          jsonData = [];
          epObj = document
            .querySelector("#show_details")
            .querySelectorAll("#pajax_a");

          for (i = 0; i < epObj.length; i++) {
            episodes.push({
              episode_name: epObj[i].title,
              episode_url: epObj[i].href,
              //season: season
            });
          }
          jsonData.push({
            url: document.URL,
            title: document.querySelector(".ttl").innerHTML,
            episode_details: episodes
          });
          return jsonData;
        })
        .then(function(data) {
          console.log(data);
          fs.appendFileSync("test3.json", JSON.stringify(data));
          //nigthmare.end()
        });
    }
  })
  
  