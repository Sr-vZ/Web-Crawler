var Crawler = require("crawler")
var _ = require('lodash')

links = [], visited = [],i = 0,t=0, currentUrl='';



var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            //console.log($('a').attr('href'));
            $('a').each(function () {
                var text = $(this).text();
                var link = $(this).attr('href');
                if (_.includes(link, 'java') == false  && _.includes(link,'hungama'))
                    links.push(link)
            })
            temp = _.differenceWith(_.uniq(links), visited);
            if(temp.length>0){
                links.push(temp)
            console.log(temp)}
            t++
            console.log('Attempt : '+ t +' Current url: '+ links[i] +' Total links: ', _.uniq(links).length)
            for (; i < links.length; i++) {
                if (_.includes(visited, links[i]) == false) {
                    visited.push(links[i])
                    visited = _.uniq(visited)
                    currentUrl = links[i]
                    c.queue(links[i])
                }
            }
        }
        done();
    }
});

// c.on('schedule', function (options) {
//     options.proxy = "http://proxy.intra.bt.com:8080";
// });
// Queue just one URL, with default callback
c.queue("http://www.hungama.com");

// Queue a list of URLs
//c.queue(["http://www.google.com/", "http://www.yahoo.com"]);
// for (i=0;i<links.length;i++){
//     c.queue(links[i])
// }