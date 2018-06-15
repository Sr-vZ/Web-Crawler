const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

url = "https://www.zee5.com/tvshows/all"; //zee movies all;

temp = JSON.parse(fs.readFileSync('zee_series.json'))
seriesID = []
for (i = 0; i < temp.length; i++) {
  seriesID[i] = t = temp[i].url.split("/")[temp[i].url.split("/").length - 1];
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
    fetchURL = 'https://catalogapi.zee5.com/v1/season/' + seriesID[i] + '?asset_subtype=episode&translation=en&sort_by_field=index&sort_order=DESC&country=IN&page_size=100&page=1'
    await page.goto(fetchURL);
    await page.waitForSelector("body");

    const totalEpisodes = await page.evaluate(() => {
      return JSON.parse(document.querySelector('pre').innerText).total;
    });
    fetchTimes = Math.round(totalEpisodes / 100)

    for (j = 0; j < fetchTimes; j++) {
      pageNo = j + 1
      pageURL = 'https://catalogapi.zee5.com/v1/season/' + seriesID[i] + '?asset_subtype=episode&translation=en&sort_by_field=index&sort_order=DESC&country=IN&page_size=100&page=' + pageNo
      await page.goto(pageURL);
      await page.waitForSelector("body");
      var episodeDetails = await page.evaluate((lang_list) => {
        data = JSON.parse(document.querySelector('pre').innerText)

        jsonData = []
        for(k=0;k<data.episodes.length;k++){
        jsonData.push({
          series_name: data.title, // String | For series name,
          title: data.episodes[k].title, //String | For episode title,
          language: lang_list[data.episodes[k].video.audiotracks[0]], //String | For language of this series,
          episode_number: data.episodes[k].index, //Integer | For episode number
          season_name: '', //String | Should be formatted like Season 1, Season 2.
          release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
          release_year: null, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
          synopsis: '', //String | Episode synopsis
          link: '', //String | Episode link
          series_link: '', //String | If series link is different then episode link.
          video_length: '', //Integer | In seconds. Always convert the episode length to time in seconds.
          image_link: '', //String | episode image link.
          stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
          director: '', //String | If only one director name is available.


        },lang_list)
      }


      })

    }
  }




  await browser.close();
})();