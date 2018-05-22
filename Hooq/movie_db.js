const fs = require('fs')

var obj = JSON.parse(fs.readFileSync('hooq_movie_test.json'))

console.log(obj.length)