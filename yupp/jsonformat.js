const fs = require('fs')

data = JSON.parse(fs.readFileSync('yupp_episodes.json'))
console.log(data[1])
for (let index = 0; index < data.length; index++) {
    d = new Date(data[index].release_date_formatted)
    // console.log(data[index].release_date_formatted)
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    console.log(d.getDate()+'-'+months[d.getMonth()]+'-'+d.getFullYear())
    data[index].release_date_formatted = d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear()
    data[index].video_length = parseInt(data[index].video_length)* 60*60
    data[index].link = ''
}

fs.writeFileSync('yupp_episodes1.json',JSON.stringify(data))