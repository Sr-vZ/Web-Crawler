const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false,
  waitTimeout: 10000
});
const fs = require("fs");
const vo = require("vo");


var _ = require("lodash");

url = "http://www.hungama.com/tv-show/motorcycle-experience/20835799/";

var obj = JSON.parse(fs.readFileSync('hungama_tv_test3.json', 'utf8'))
// console.log(obj[0].url)

var urls = []
for (i = 0; i < obj.length; i++) {
  urls[i] = obj[i].url
}

urls = _.uniq(urls)




alldata = []


var queueUrls = function*(){

for(k=0;k<urls.length;k++){
  url = urls[k]
  var data = yield nightmare
  .goto(url)
  //.inject("js", "https://code.jquery.com/jquery-3.3.1.slim.min.js")
  .wait('ttl')
  .evaluate(() => {
    var x = [];
    s = document.querySelectorAll(".tvshow");
    for (i = 0; i < s.length; i++) {
      x[i] = s[i].getAttribute('value');
      x[i] = x[i].substr(x[i].indexOf('-') + 1, x[i].length)
    }
    return x;
  })
  .then(function (res) {
    console.log('api links: ', res)
    var api = [];
    for (i = 0; i < res.length; i++) {
      api[i] = url + '/?c=tvshow&m=seasondata1&sno=' + res[i] + '&page_no=1';
    }
    var run = function* () {
      //var alldata = [];
      var epdata = []

      for (var i = 0; i < api.length; i++) {
        // epdata.push({
        //   season: 'Season ' + i
        // })
        var title = yield nightmare
          .goto(api[i])
          .wait('body')
          .evaluate(() => {
            return JSON.parse(document.body.innerText)
          })
          .then(function (res) {
            console.log('url: '+url+' Season ' +(i+1)+' '+res)
            epdata.push({
              url: url,
              Season: 'Season ' + (i+1),
              SeasonDetails: res
            })
            alldata.push(epdata)
          })
      }
      return epdata;
    };

    vo(run)(function (err, res) {
      console.dir(res);
      fs.appendFileSync('tv_test_dump.json', JSON.stringify(res))
    })
    //return nightmare.end()
    console.log(alldata)
    // return alldata
  })
  // return alldata
  }
  return alldata
}

vo(queueUrls)(function (err, res) {
  console.log(res);
  fs.appendFileSync('tv_all_dump.json', JSON.stringify(res))
})
