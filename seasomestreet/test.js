/* var ffprobe = require('ffprobe'),
    ffprobeStatic = require('ffprobe-static');
ffprobe('https://www.kaltura.com/p/1786071/sp/178607100/playManifest/entryId/0_jf4t7x22/flavorParamId/487071/format/url/protocol/http/video.mp4', { path: ffprobeStatic.path }, function (err, info) {
    // if (err) return done(err);
    console.log(info);
});
 */

var ffmpeg = require('fluent-ffmpeg');
const fs = require('fs')

const Path = require('path')



ffmpeg.setFfmpegPath('C:\\Users\\608619925\\desktop\\Misc Projects\\NodeJs\\web-crawler\\Web-Crawler\\seasomestreet\\ffmpeg.exe')
ffmpeg.setFfprobePath('C:\\Users\\608619925\\desktop\\Misc Projects\\NodeJs\\web-crawler\\Web-Crawler\\seasomestreet\\ffprobe.exe') 

temp = JSON.parse(fs.readFileSync('ss_videos.json'))

videoURLS = []
for(i=0;i<temp.length;i++){
    videoURLS[i] = temp[i].downloadUrl
}
data = [], meta = []


/* for(i=0;i<videoURLS.length;i++){
    ffmpeg.ffprobe(videoURLS[i], function (err, metadata) {
        console.log(videoURLS[i])
        console.log(temp[i].title, metadata);
        // fs.writeFileSync('test.json',JSON.stringify(metadata))
        meta.push({
            title: temp[i].title,
            video_length: metadata.format.duration,
            synopsis: temp[i].parenttip,
            image_link: temp[i].thumbnail,
            link: temp[i].downloadUrl
        })
    });
    data = data.concat(meta)
} */

// videoURLS.forEach(async(url) =>  {
    for (i = 0; i < videoURLS.length; i++) {   
        url = videoURLS[i]
     ffmpeg.ffprobe(url, async function (err, metadata) {
        console.log(url);
        // fs.writeFileSync('test.json',JSON.stringify(metadata))
        console.log(metadata.format.duration)
        meta.push({
            link:url,
            video_length: metadata.format.duration
        })
        
        data = data.concat(meta)
    });
        fs.appendFileSync('meta.json', JSON.stringify(meta, null, 2))
}
/* ffmpeg.ffprobe('https://www.kaltura.com/p/1786071/sp/178607100/playManifest/entryId/0_jf4t7x22/flavorParamId/487071/format/url/protocol/http/video.mp4', function (err, metadata) {
    console.log(metadata.format.duration);
    // fs.writeFileSync('test.json',JSON.stringify(metadata))
});
 */

 fs.writeFileSync('ss_video_deatils.json',JSON.stringify(meta,null,2))
