const fs = require('fs')
const _ =require('lodash')

var dump_data = JSON.parse(fs.readFileSync('youtube_tvf_dump.json', 'utf-8'))
var dump_details = JSON.parse(fs.readFileSync('yt_tvf_details_dump.json', 'utf-8'))

console.log(dump_data[0].link)
console.log(_.findIndex(dump_details,['url',dump_data[7].link]))

for(i=0;i<dump_data.length;i++){
    idx = _.findIndex(dump_details,['url',dump_data[i].link])
    
    dump_data[i].date_published = dump_details[idx].date_published
    dump_data[i].description = dump_details[idx].description

}
console.log(dump_data)

fs.writeFileSync('yt_tvf_merged.json',JSON.stringify(dump_data))