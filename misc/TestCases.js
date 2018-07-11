// A test case checker for the json file before submission to OTT dump

const fs = require('fs')

inputFile = ''

fs.readFile(inputFile,function (err,buff) {
    if(err){
        console.log('Error during file read: '+err)
    }
    data = JSON.parse(buff)
    for(i=0;i<data.length;i++){
        if(data[i].link){
            console.log('link is present and ' + typeof (data[i].link))
        }
        if (data[i].language){
            console.log('language is present and ' + typeof (data[i].language))
        }
        if (data[i].languages) {
            console.log('language is present and ' + typeof (data[i].language))
        }
    }
})