const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: false });


  var urls = [
      'http://www.hungama.com/movie/the-perks-of-being-a-wallflower/28800664/',
      'http://www.hungama.com/movie/silver-lining-playbook/29283854/',
      'http://www.hungama.com/movie/empire-state/17985506/',
      "http://www.hungama.com/movie/the-hangover-part-3/2170359/",
      "http://www.hungama.com/movie/blue-valentine/17262486/",
      "http://www.hungama.com/movie/american-sniper/7454061/"
    ];
    var results = [];
    urls.forEach(function(url) {
      nightmare.goto(url)
        .wait('body')
        .title()
        .then(function(result) {
          results.push(result);
        });
    });
    console.dir(results)