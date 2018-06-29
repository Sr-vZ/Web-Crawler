const fs =require('fs')

fs.readFile('mubi_test4.json',function(d){
    data = JSON.parse(d)
    console.log(data.length)
})