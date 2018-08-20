const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://web-api-us.crackle.com/Service.svc/browse/movies/full/all/alpha-asc/US/20/1?format=json';
seriesIDs = []
episodeIDs = []
seriesDetails = JSON.parse(fs.readFileSync('crackle_series_incomp.json'))
temp = JSON.parse(fs.readFileSync('crackle_showlist.json'))
for (i = 0; i < temp.length; i++) {
    // seriesURLS[i] = 'https://web-api-us.crackle.com/Service.svc/channel/' + temp[i].movieID + '/playlists/all/US?format=json'
    seriesIDs[i] = temp[i].movieID
}
castURLS = []

// function getSeriesID(name){
//     for(i=0;i<temp.length;i++){
//         if(temp[i].movieTitle === name){
//             return temp[i].movieID
//         }
//     }
// }

// seriesLinkIDS=[]
// for (i = 0; i < seriesDetails.length; i++) {
//     x = seriesDetails[i].link
//     x.substring(x.lastIndexOf('/')+1,x.length)
//     episodeIDs[i] = parseInt(x)
//     seriesLinkIDS.push({
//         episodeID:episodeIDs[i],
//         seriesID:getSeriesID(seriesDetails[i].series_name)
//     })

// }

// console.log(seriesLinkIDS)

for (i = 0; i < seriesDetails.length; i++) {
    castURLS[i] = seriesDetails[i].castURL
}


(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);
    // const jsonOutput = await page.evaluate(() => {
    //     data = JSON.parse(document.querySelector('pre').innerText)

    //     return data
    // })
    // for (i = 0; i < castURLS.length; i++) {
        for (i = 0; i < 20; i++) {

        
        castURL = castURLS[i]
        console.log(i + ' of ' + castURLS.length+' : '+castURL)
        await page.goto(castURL)
        await page.waitForSelector('body');
        var castDetails = await page.evaluate(() => {
            cast = []

            castdata = JSON.parse(document.querySelector('pre').innerText)
            tmp = castdata.Result.MediaTooltips[0].Cast
            for (c = 0; c < tmp.length; c++) {
                cast.push({
                    "name": tmp[c],
                    "image_link": ""
                })
            }
            directors = castdata.Result.MediaTooltips[0].Directors
            return {
                cast: cast,
                directors: directors
            }


        })
        console.log(castDetails.cast)
        seriesDetails[i].cast = castDetails.cast
        seriesDetails[i].directors = castDetails.directors
        delete seriesDetails[i].seriesID
        delete seriesDetails[i].episodeID
        delete seriesDetails[i].castURL
    }



    fs.writeFileSync('test.json', JSON.stringify(seriesDetails, null, 2))
    await browser.close();
})();