var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')
var _ = require('lodash')

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


request(urls[0], function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    var parsedResults = [];
    

      var jsonData = []          
          episodes = []

          if ($('#show_details #pajax_a').length > 0)
            epObj = $('#show_details').find('#pajax_a')

          for (i = 0; epObj.length; i++) {
            episodes.push({
              'episode_name': epObj.title,
              'episode_url': epObj.href
            })
          }
          jsonData.push({
            "url": $.URL,
            "title": $('.ttl').innerHTML,
            "episode_details": episodes
          });
          return jsonData;
    
    // Log our finished parse results in the terminal
    console.log(jsonData);
  }
});