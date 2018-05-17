const fs = require('fs')


inputFile = "yt_TSP_dump.json";
outputFile = "yt_TSP_details_dump.json";
var data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'))

// for (i=0;i<data.length;i++){

// }

// console.log(data[0].link)

const Nightmare = require("nightmare");
const nightmare = Nightmare({
    show: false
});

urls = []
for (i = 0; i < data.length; i++) {
    urls[i] = data[i].link
}
// console.log(urls)
var alldata = [],
    i = 0,
    totalUrl = urls.length;

urls.reduce(function (accumulator, url) {
    return accumulator.then(function (results) {
        return nightmare.goto(url)
            .goto(url)
            .wait(2000)
            .evaluate(
                () => {
                    var jsonData = [],
                        description = '';

                    if (document.querySelectorAll('#description').length > 0)
                        description = document.querySelector('#description').innerText
                    else
                        description = ''

                    jsonData.push({
                        'url': document.URL,
                        'description': description,
                        'date_published': document.querySelector('.date').innerText.replace('Published on ', '')
                    });
                    return jsonData;
                })
            //.end()
            .then(function (data) {
                i++;
                console.log(i + '/' + totalUrl + ' Fetched ' + url + ' at ' + (new Date()));
                fs.appendFileSync('yt_test_dump.json', JSON.stringify(data[0]));
                alldata.push(data[0]);
                return data;
            })
            .catch(error => {
                errorData = []
                console.error("Search failed:", error);
                errorData.push({
                    'url': url,
                    'time' : new Date()
                })
                fs.appendFileSync('yt_errors.json', JSON.stringify(errorData))
            });
    });
}, Promise.resolve([])).then(function (results) {
    fs.appendFileSync(outputFile, JSON.stringify(alldata));
    console.log(alldata);
    nightmare.end();
});