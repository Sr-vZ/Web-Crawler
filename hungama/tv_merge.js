const fs = require('fs')
var _ = require('lodash')








var series_details = JSON.parse(fs.readFileSync('hungama_tv_test3.json','utf8'))

var episode_details = JSON.parse(fs.readFileSync('hungama_tv_testdata1.json','utf8'))

//console.log(series_details[0].url)

console.log(episode_details[7][0].url)

commonURL = episode_details[7][0].url
    idx = _.findIndex(series_details, ['url', commonURL])
    console.log(idx,' ',series_details[idx].url)

var mergedData = []

for(i=0;i<episode_details.length;i++){
    commonURL = episode_details[i][0].url
    idx = _.findIndex(series_details, ['url', commonURL])
    //commonURL = episode_details[i][0].url
    //idx = _.findIndex(series_details, ['url', commonURL])
    //console.log(idx,' ',series_details[idx].url)
    for(j=0;j<episode_details[i].length;j++){
        //console.log( episode_details[i][j].SeasonDetails)
        for(k=0;k<episode_details[i][j].SeasonDetails.length;k++){
            //console.log(episode_details[i][j].SeasonDetails[k].episode_name)
            mergedData.push({
                "series_name" : series_details[idx].series_name,
                "episode_number" : k+1,
                "episode_name" : episode_details[i][j].SeasonDetails[k].episode_name,
                "stars" : series_details[idx].stars,
                "genre" : series_details[idx].genre,
                "synopsis" : series_details[idx].synopsis,
                "image_link" : episode_details[i][j].SeasonDetails[k].episode_image,
                "episode_url" : episode_details[i][j].SeasonDetails[k].tvshow_url
            })

        }

    }

}

fs.writeFileSync('tv_merged.json',JSON.stringify(mergedData))