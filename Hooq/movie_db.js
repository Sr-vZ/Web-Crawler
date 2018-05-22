const fs = require('fs')

var obj = JSON.parse(fs.readFileSync('hooq_movie_dump.json'))

console.log(obj.length)