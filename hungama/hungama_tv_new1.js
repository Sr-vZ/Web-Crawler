var fs = require('fs')
var _ = require('lodash')
const vo = require("vo");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false
});
const nightmare2 = Nightmare({
  show: false
});

var obj = JSON.parse(fs.readFileSync('hungama_tv_test3.json', 'utf8'))
// console.log(obj[0].url)

var urls = []
for (i = 0; i < obj.length; i++) {
  urls[i] = obj[i].url
}

urls = _.uniq(urls)

var alldata = [],
j = 0,
  totalUrl = urls.length;

urls.reduce(function (accumulator, url) {
  return accumulator.then(function (results) {
    return nightmare
      .goto(url)
      .wait(2000)
      .evaluate(
        () => {
          var x = [];
          s = document.querySelectorAll(".tvshow");
          for (i = 0; i < s.length; i++) {
            x[i] = s[i].getAttribute('value');
            x[i] = x[i].substr(x[i].indexOf('-') + 1, x[i].length)
          }
          return x;
          //return jsonData;
        })
      //.end()
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
            var title = yield nightmare2
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
        j++;
        console.log(j + '/' + totalUrl + ' Fetched ' + url + ' at ' + (new Date()));
        //fs.appendFileSync('hungama_tv_new_dump.json', JSON.stringify(data[0]));
        //alldata.push(data[0]);
        return alldata;
      })
      .catch(error => {
        errorData = []
        console.error("Search failed:", url, error);
        errorData.push({
          'url': url,
          'time': new Date()
        })
        fs.appendFileSync('hungama_tv_new_errors.json', JSON.stringify(errorData))
      });
  });
}, Promise.resolve([])).then(function (results) {
  fs.appendFileSync('hungama_tv_testdata1.json', JSON.stringify(alldata));
  console.log(alldata);
  nightmare.end();
});