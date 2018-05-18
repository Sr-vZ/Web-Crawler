const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false,
  waitTimeout: 10000
});
const fs = require("fs");
const vo = require("vo");


var _ = require("lodash");

url = "http://www.hungama.com/tv-show/motorcycle-experience/20835799/";

alldata = []

nightmare
  .goto(url)
  //.inject("js", "https://code.jquery.com/jquery-3.3.1.slim.min.js")
  .wait(5000)
  .evaluate(() => {
    var x = [];
    s = document.querySelectorAll(".tvshow");
    for (i = 0; i < s.length; i++){ 
        x[i]=s[i].getAttribute('value');
        x[i]=x[i].substr(x[i].indexOf('-')+1,x[i].length)
    }
    return x;
  })
  .then(function(res) {
    
    console.log(res)
    res
    var api =[];
    for(i=0;i<res.length;i++){
    api[i] = url + '/?c=tvshow&m=seasondata1&sno='+res[i]+'&page_no=1';
    
    // return nightmare.goto(api)        
    //     .wait(3000)
    //     .evaluate(()=>{
    //         return JSON.parse(document.body.innerText)
    //     })
    //     .then(function (res) {
    //         console.log(res)
    //         alldata.push(res)
    //     })
    }   
    var run = function*() {
      //var alldata = [];
      var epdata =[]
      for (var i = 0; i < api.length; i++) {
        var title = yield nightmare
          .goto(api[i])
          .wait('body')
          .evaluate(()=>{
            return JSON.parse(document.body.innerText)
        })
        .then(function (res) {
            console.log(res)
            epdata.push(res)
            alldata.push(res)
        })
      }
      return epdata;
    };

    vo(run)(function(err, res) {
      console.dir(res);
    })
   //return nightmare.end()
   console.log(alldata)
  })
  
