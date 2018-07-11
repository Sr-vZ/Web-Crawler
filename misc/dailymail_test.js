var fs = require("fs");
var _ = require("lodash");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false, 
  height: 900,
  width:1200,
  webPreferences: {webSecurity: false}
});

url = "http://www.dailymail.co.uk/home/index.html";

nightmare
  .goto(url)
  //.type("#search_form_input_homepage", "github nightmare")
  //.click("#search_button_homepage")
  .wait('body')
  .evaluate(() => {
    var x = [];
    s = document.querySelectorAll("iframe[id*='google_ads_iframe_']");
    for (i = 0; i < s.length; i++) {
      c = (s[i].contentWindow || s[i].contentDocument);
      x.push({
        ad_html:c.document,
        //ad_image: c.document.querySelector("img").src,
        //ad_url: c.document.querySelector("img").getAttribute("onclick")
      });
    }

    return x;
  })
  //.end()
  .then(function(res) {
    fs.writeFileSync("dailymail_ads.json", JSON.stringify(res));
  })
  .catch(error => {
    console.error("Search failed:", error);
  });
