const fs = require('fs')
var _ = require('lodash')

tmp = JSON.parse(fs.readFileSync('mubi_movieList.json'));
movieURLS = [], titles = [], imgLinks = []
for (i = 0; i < tmp.length; i++) {
    movieURLS[i] = tmp[i].movieLink
    titles[i] = tmp[i].movieTitle
    imgLinks[i] = tmp[i].movieImg
}

movieURLS = _.uniq(movieURLS)

console.log(movieURLS.length)
uniqueLink =[]
fs.readFile('mubi_test4.json', function (err, data) {
    data = JSON.parse(data)
    console.log(data.length)
    for (i = 0; i < data.length; i++){
        idx = _.indexOf(movieURLS,data[i].link)
        data[i].image_link = imgLinks[idx]
        data[i].title = titles[idx]
    }
fs.writeFileSync('test.json',JSON.stringify(data,null,2))
})

idx = _.indexOf(movieURLS,'https://mubi.com/films/american-beach-house')
console.log(idx)