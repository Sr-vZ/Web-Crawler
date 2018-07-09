const puppeteer = require("puppeteer");
const fs = require("fs");


temp = JSON.parse(fs.readFileSync('kanopy_movieList.json'))

movieURLS = []

for(i=0;i<temp.length;i++){
    movieURLS[i] = temp [i].movieLink
}

const CONCURRENCY = 5;

