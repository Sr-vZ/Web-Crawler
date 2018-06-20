const fs = require('fs')


inputFile = 'cr_anime.json'

outputFile = 'cr_drama_edit.json'

data = JSON.parse(fs.readFileSync(inputFile))

for(i=0;i<data.length;i++){
    temp = data[i].link.substring(data[i].link.lastIndexOf('/'), data[i].link.length)
    episodeNo = temp.split('-')[1]
    console.log('link : '+data[i].link+' epsiode no: '+episodeNo)
    data[i].episode_number = parseInt(episodeNo)
    data[i].release_year = parseInt(data[i].release_year)
}

fs.writeFileSync('cr_anime.json',JSON.stringify(data))
