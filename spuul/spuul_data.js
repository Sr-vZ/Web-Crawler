const fs = require('fs')

data = []
fs.readFile('spuul_api3.json',function(fdata){
    data = JSON.parse(fdata)
    console.log(data)
})

fdata = fs.readFileSync('spuul_api3.json')
data = JSON.parse(fdata)

console.log(data)

