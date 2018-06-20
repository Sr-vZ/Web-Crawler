const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

url = "http://www.crunchyroll.com/videos/drama"; //

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("body");

  const dramaList = await page.evaluate(() => {
    data = document.querySelectorAll('.hover-bubble')
    jsonData = []
    for (i = 0; i < data.length; i++) {
      jsonData.push({
        series_name: data[i].querySelector('.series-title').innerText, // String | For series name,
        title: '', //String | For episode title,
        language: '', //String | For language of this series,
        episode_number: null, //Integer | For episode number
        season_name: '', //String | Should be formatted like Season 1, Season 2.
        release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
        release_year: null, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
        synopsis: '', //String | Episode synopsis
        link: '', // String | Episode link
        series_link: data[i].querySelector('.portrait-element').href, //String | If series link is different then episode link.
        video_length: null, //Integer | In seconds. Always convert the episode length to time in seconds.
        image_link: data[i].querySelector('img').src, //String | episode image link.
        stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
        director: '', //String | If only one director name is available.
      })
    }
    return jsonData
  })

  episodes = []
  for (i = 0; i < dramaList.length; i++) {
    dramaURL = dramaList.series_link
    seriesName = dramaList.series_name
    await page.goto(dramaURL);
    await page.waitForSelector("body");

    const episodeList = await page.evaluate((dramaURL, seriesName) => {
      data = document.querySelectorAll('.hover-bubble')
      episodeLink = data[i].querySelector('.portrait-element').href

      jsonData =[]



      for (j = 0; j < data.length; j++) {
        jsonData.push({
          series_name: seriesName, // String | For series name,
          title: '', //String | For episode title,
          language: '', //String | For language of this series,
          episode_number: '', //Integer | For episode number
          season_name: '', //String | Should be formatted like Season 1, Season 2.
          release_date_formatted: '', //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
          release_year: null, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
          synopsis: '', //String | Episode synopsis
          link: data[j].querySelector('.portrait-element').href, // String | Episode link
          series_link: dramaURL, //String | If series link is different then episode link.
          video_length: null, //Integer | In seconds. Always convert the episode length to time in seconds.
          image_link: data[j].querySelector('img').src, //String | episode image link.
          stars: [], //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
          director: '', //String | If only one director name is available.
        })
      }
      return jsonData
    }, dramaURL, seriesName)
    episodes = episodes.concat(episodeList)
  }

  // await page.goto(episodeLink);
  // await page.waitForSelector("body");

  // const episodeDetails = await page.evaluate(() => {
  //   jsonData = []
  //   document.querySelector('#showmedia_about_info > p > span:nth-child(3) > a').click()
  //   rd = document.querySelector('#showmedia_about_info_details > div:nth-child(3) > span').innerText
  //   temp = rd.split(' ')
  //   release_date = temp[1].replace(',', '') + '-' + temp[0] + '-' + temp[2]
  //   jsonData.push({
  //     title: document.querySelector('#showmedia_about_name').innerText,
  //     synopsis: document.querySelector('.description ').innerText,
  //     release_date: release_date,
  //     episode_number: document.querySelector('#showmedia_about_media > h4:nth-child(2)').innerText.split(' ')[1]
  //   })
  //   return jsonData
  // })




  fs.writeFileSync('cr_drama.json', JSON.stringify(episodes))

  await browser.close();
})();