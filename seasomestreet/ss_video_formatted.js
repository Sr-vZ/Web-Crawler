const fs = require('fs')


temp = JSON.parse(fs.readFileSync('ss_videos.json'))
meta = JSON.parse(fs.readFileSync('meta_test.json'))

console.log(temp.length)
console.log(meta.length)

data = []
for(i=0;i<temp.length;i++){
jsonData = []
    jsonData.push({
        title: temp[i].title,
        video_length: meta[i].video_length,
        synopsis: temp[i].parenttip,
        image_link: temp[i].thumbnail,
        link: temp[i].downloadUrl
    })
    data = data.concat(jsonData)
}

fs.writeFileSync('ss_videos_details.json',JSON.stringify(data,null,2))