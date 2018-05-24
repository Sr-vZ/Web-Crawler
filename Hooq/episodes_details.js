const fs = require('fs')
var JSONStream = require('JSONStream')
// const bfj = require('bfj')
var es = require('event-stream');

var _ = require('lodash')
// var obj = JSON.parse(fs.readFileSync('episode_data.json'))

// console.log(obj[0])

// var temp = fs.('episode_data.json',function (res) {
//     console.log(res)
// })
//var obj = temp.split(',')
//console.log(temp)
filePath = 'episodes_dump.json'
const stream = fs.createReadStream(filePath);


var epData =[],seriesData = [],titles=[]

var data = '';
seriesData = JSON.parse(fs.readFileSync('hooq_tv_test.json'))

for(i=0;i<seriesData.length;i++){
        for (j = 0; j < seriesData[i].length; j++) {
            titles.push({
                id: seriesData[i][j].id,
                title : seriesData[i][j].attributes.title
            })
    }}

//console.log(titles)

episodeDetails =[]

var getStream = function () {
    var jsonData = filePath,
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
        return stream.pipe(parser);
};

 getStream()
  .pipe(es.mapSync(function (data) {
    //console.log(data);
    epData.push(data)
   
    
  }));
getStream()
    .on('end',function () {
        //console.log(obj);
        idx = _.findIndex(titles,['id',epData[9000].parent_id])
        //console.log(epData[9000].parent_id)
        //console.log(idx, titles[idx])
        for(i=0;i<epData.length;i++){
            idx = _.findIndex(titles,['id',epData[i].parent_id])
            stars = []
            for(s=0;s<epData[i].people.length;s++){
                if(epData[i].people[s].role==='CAST')
                    stars.push(epData[i].people[s].name)
            }
            
            episodeDetails.push({
                series_title: titles[idx].title,
                season: epData[i].season,
                episode: epData[i].episode,
                ageRating: epData[i].meta.ageRating,
                release_year: epData[i].meta.releaseYear,
                synopsis:epData[i].description,
                episode_title:epData[i].title,
                language: epData[i].languages,
                video_length: epData[i].running_time_player,
                genre: epData[i].tags[0].label,
                stars: stars,
                id: epData[i].id,
                parent_id: epData[i].parent_id
            })
        }
        console.log(episodeDetails[0])
    })



