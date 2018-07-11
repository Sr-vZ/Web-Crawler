// core modules
var fs = require('fs');
var url = require('url');

// third party modules
var _ = require('lodash');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');

var base = "www.hungama.com";
var firstLink = 'http://' + base;

var crawled = [];
var inboundLinks = [];

var proxiedRequest = request.defaults({
    'proxy': 'http://proxy.intra.bt.com:8080'
})

var makeRequest = function (crawlUrl, callback) {
    var startTime = new Date().getTime();
    //request(crawlUrl, function (error, response, body) {
    proxiedRequest.get(crawlUrl, function (error, response, body) {
        var pageObject = {};
        pageObject.links = [];

        var endTime = new Date().getTime();
        var requestTime = endTime - startTime;
        pageObject.requestTime = requestTime;

        var $ = cheerio.load(body);
        pageObject.title = $("title").text();
        pageObject.url = crawlUrl;
        $("a").each(function (i, elem) {
            /*
                 insert some further checks if a link is:
                 * valid
                 * relative or absolute
                 * check out the url module of node: https://nodejs.org/dist/latest-v5.x/docs/api/url.html
                */
            if (_.includes(elem.attribs.href, "java") == false && typeof elem.attribs.href === "string") {
              pageObject.links.push({
                linkText: $(elem).text(),
                linkUrl: elem.attribs.href
              });
            }
        });
        callback(error, pageObject);
    });
}

var myLoop = function (link) {
    makeRequest(link, function (error, pageObject) {
        console.log(pageObject);
        crawled.push(pageObject.url);
        async.eachSeries(pageObject.links, function (item, cb) {
            parsedUrl = url.parse(item.linkUrl);
            // test if the url actually points to the same domain
            if (parsedUrl.hostname == base) {
                /*
                 insert some further link error checking here
                */
                inboundLinks.push(item.linkUrl);
                console.log('total link: '+inboundLinks.length + ' current url: '+item.linkUrl)
            }
            cb();
        }, function () {
            var nextLink = _.difference(_.uniq(inboundLinks), crawled);
            if (nextLink.length > 0) {
                myLoop(nextLink[0]);
            } else {
                fs.writeFileSync('crawl_test.json',JSON.stringify(inboundLinks))
                console.log("done!");
            }
        });
    });
}

myLoop(firstLink);