var fs = require('fs')
var _ = require('lodash')


const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: true
});

var obj = JSON.parse(fs.readFileSync('hungama_tv_test3.json', 'utf8'))
// console.log(obj[0].url)

var urls = []
for (i = 0; i < obj.length; i++) {
  urls[i] = obj[i].url
}

urls = _.uniq(urls)

var alldata = [],
  i = 0,
  totalUrl = urls.length;

urls.reduce(function (accumulator, url) {
  return accumulator.then(function (results) {
    return nightmare
      .goto(url)
      .wait(2000)
      .evaluate(
        () => {
          var jsonData = []          
          episodes = []
          if (document.querySelectorAll('.tvshow ').length > 0){
            seasons = document.querySelectorAll('.tvshow ')
          
          for(i=0;i<seasons.length;i++)
            seasons[i].click()
          }
          
          if (document.querySelector('#show_details').querySelectorAll('#pajax_a').length > 0)
            epObj = document.querySelector('#show_details').querySelectorAll('#pajax_a')

          for (i = 0; i < epObj.length; i++) {
            episodes.push({
              'episode_name': epObj[i].title,
              'episode_url': epObj[i].href
            })
          }
          jsonData.push({
            "url": document.URL,
            "title": document.querySelector('.ttl').innerHTML,
            "episode_details": episodes
          });
          return jsonData;
        })
      //.end()
      .then(function (data) {
        i++;
        console.log(i + '/' + totalUrl + ' Fetched ' + url + ' at ' + (new Date()));
        fs.appendFileSync('hungama_tv_new_dump.json', JSON.stringify(data[0]));
        alldata.push(data[0]);
        return data;
      })
      .catch(error => {
        errorData = []
        console.error("Search failed:", url , error);
        errorData.push({
          'url': url,
          'time': new Date()
        })
        fs.appendFileSync('hungama_tv_new_errors.json', JSON.stringify(errorData))
      });
  });
}, Promise.resolve([])).then(function (results) {
  fs.appendFileSync('hungama_tv_testdata.json', JSON.stringify(alldata));
  console.log(alldata);
  nightmare.end();
});