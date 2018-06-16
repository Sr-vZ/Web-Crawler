

const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

url = "https://www.zee5.com/tvshows/all"; //zee movies all;

temp = JSON.parse(fs.readFileSync('zee_series.json'))
seriesID = []
for (i = 0; i < temp.length; i++) {
  seriesID[i] = temp[i].link.split("/")[temp[i].link.split("/").length - 1];
}

lang_list = {
  hi: "Hindi",
  mr: "Marathi",
  en: "English",
  kn: "Kannada",
  bn: "Bengali",
  ml: "Malayalam",
  pa: "Punjabi",
  gu: "Gujarati",
  ta: "Tamil",
  te: "Telegu"
};
(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("body");

  for (i = 0; i < seriesID.length; i++) {
    // episodeURL = 'https://catalogapi.zee5.com/v1/season/0-2-KundaliBhagya1?asset_subtype=episode&translation=en&sort_by_field=index&sort_order=DESC&country=IN&page_size=100&page=2'
    //https://catalogapi.zee5.com/v1/tvshow/0-6-tvshow_1272150422
    seriesURL = 'https://catalogapi.zee5.com/v1/tvshow/' + seriesID[i]

    await page.goto(seriesURL)
    await page.waitForSelector('body')
    console.log(i + ' of ' + seriesID.length + ' fetching series: ' + seriesID[i])
    const seriesDetails = await page.evaluate(() => {
      data = JSON.parse(document.querySelector('pre').innerText)
      jsonData = []
      stars = []
      if (data.actors.length > 0) {
        for (s = 0; s < data.actors.length; s++) {
          stars.push({
            name: data.actors[s].split(':')[0],
            image_link: ''
          })
        }
      }
      seasons = []
      for (s = 0; s < data.seasons.length; s++) {
        seasons.push({
          id: data.seasons[s].id,
          title: data.seasons[s].title,
          season_no: s + 1
        })
      }

      jsonData.push({
        title:data.title,
        lang: data.languages[0],
        stars: stars,
        season_details: seasons
      })
      return jsonData
    })
    // console.dir(seriesDetails)
    // console.log(seriesDetails.season_details)
    for (l = 0; l < seriesDetails[0].season_details.length; l++) {

      seasonID = seriesDetails[0].season_details[l].id
      seasonTitle = seriesDetails[0].season_details[l].title
      language = lang_list[seriesDetails[0].lang]
      seriesLink = 'https://www.zee5.com/tvshows/details/' + seriesDetails[0].title.toLocaleLowerCase().replace(' ', '-') +'/'+seriesID[i]

      fetchURL = 'https://catalogapi.zee5.com/v1/season/' + seasonID + '?asset_subtype=episode&translation=en&sort_by_field=index&sort_order=DESC&country=IN&page_size=100&page=1'
      await page.goto(fetchURL);
      await page.waitForSelector("body");

      const totalEpisodes = await page.evaluate(() => {
        return JSON.parse(document.querySelector('pre').innerText).total;
      });
      fetchTimes = Math.round(totalEpisodes / 100)

      for (j = 0; j < fetchTimes; j++) {
        pageNo = j + 1
        pageURL = 'https://catalogapi.zee5.com/v1/season/' + seasonID + '?asset_subtype=episode&translation=en&sort_by_field=index&sort_order=DESC&country=IN&page_size=100&page=' + pageNo
        await page.goto(pageURL);
        await page.waitForSelector("body");

        console.log(j + ' of ' + fetchTimes + ' fetching season: ' + seasonTitle)
        var episodeDetails = await page.evaluate((seriesLink, language, seasonTitle) => {
          data = JSON.parse(document.querySelector('pre').innerText)


          months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          jsonData = []
          for (k = 0; k < data.episodes.length; k++) {
            release_date = new Date(data.episodes[k].release_date);
            /* lang = ''
            if (data.episodes[k].video.audiotracks) {
              lang = lang_list[data.episodes[k].video.audiotracks[0]]
            } */
            jsonData.push({
              series_name: data.title, // String | For series name,
              title: data.episodes[k].title, //String | For episode title,
              language: language, //String | For language of this series,
              episode_number: data.episodes[k].index, //Integer | For episode number
              season_name: seasonTitle, //String | Should be formatted like Season 1, Season 2.
              release_date_formatted: release_date.getDate() + '-' + months[release_date.getMonth()] + '-' + release_date.getFullYear(), //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
              release_year: parseInt(release_date.getFullYear()), //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
              synopsis: data.episodes[k].description, //String | Episode synopsis
              link: '', //String | Episode link
              series_link: seriesLink, //String | If series link is different then episode link.
              video_length: parseInt(data.episodes[k].duration), //Integer | In seconds. Always convert the episode length to time in seconds.
              image_link: '', //String | episode image link.
              stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
              director: '', //String | If only one director name is available.


            })
          }
          return jsonData

        }, seriesLink, language, seasonTitle)
        fs.appendFileSync("zee_episodes.json", JSON.stringify(episodeDetails));
      }
    }

  }


  await browser.close();
})();