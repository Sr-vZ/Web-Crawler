// For now start with these channels and we will request more as needed.

// https://www.youtube.com/channel/UCf47je2ETRtgkhaVctg76Ew/videos
// https://www.youtube.com/channel/UCod3ehQL75jWcFGldE1xyug/videos
// https://www.youtube.com/channel/UCYhE3LuAdW98CdwoemBsrdA/videos
// https://www.youtube.com/channel/UC9Jly1IEjKrjVBUAhMSPvTQ/videos
// https://www.youtube.com/channel/UCRqoo3YKNHVJW8HopWvT98w/videos
// https://www.youtube.com/channel/UCQFMqkiJD9R4RSH9IJ6tb4w/videos
// https://www.youtube.com/channel/UCJfXLs_yEJvffKgt-jniMUQ/videos
// https://www.youtube.com/channel/UCF-aIi0zXNwZZucGtWk4pug/videos
// https://www.youtube.com/channel/UCNyeSfUfffmJXwA2_tmNG9A/videos
// {videos: [{channel_link, image_link, link, heading, video_length, date_published, description}]}


// core modules
var fs = require("fs");
var url = require("url");

// third party modules
var _ = require("lodash");
var async = require("async");
var cheerio = require("cheerio");
var request = require("request");
var vo = require('vo');


const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false
});


url = 'https://www.youtube.com/channel/UCNJcSUSzUeFm8W9P7UUlSeQ/videos'

var run = function* () {
    yield nightmare.goto(url);
  
    var previousHeight, currentHeight = 0;
    while (previousHeight !== currentHeight) {
      previousHeight = currentHeight;
      var currentHeight = yield nightmare.evaluate(function () {
        return document.body.scrollHeight;
      });
      yield nightmare.scrollTo(currentHeight, 0)
        .wait(3000);
    }
    yield nightmare
      .evaluate(() => {
        data = document.querySelectorAll('.art-ttl');
        tv_links = [];
        for (i = 0; i < data.length; i++) {
          tv_links[i] = data[i].href;
        }
        return tv_links
      })
      .end()
      .then(function (data) {
        console.dir(data);
        fs.appendFileSync("youtube.json", JSON.stringify(data));
      })
  
  };
  
  vo(run)(function (err) {
    console.dir(err);
    console.log('done');
  });