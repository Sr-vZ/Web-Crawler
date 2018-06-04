const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

url = "https://www.zee5.com/tvshows/all"; //zee movies all;

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("body");

  console.log("Scrolling through page");

  // await autoScroll(page);

  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      try {
        const maxScroll = Number.MAX_SAFE_INTEGER;
        let lastScroll = 0;
        const interval = setInterval(() => {
          window.scrollBy(0, 1000);
          const scrollTop = document.documentElement.scrollTop;
          if (scrollTop === maxScroll || scrollTop === lastScroll) {
            clearInterval(interval);
            resolve();
          } else {
            lastScroll = scrollTop;
          }
        }, 500);
      } catch (err) {
        console.log(err);
        reject(err.toString());
      }
    });
  });
  // console.log('Dimensions:', dimensions);
  const seriesData = await page.evaluate(() => {
    jsonData = [];
    data = document.querySelectorAll(".grid");

    for (i = 0; i < data.length; i++) {
      jsonData.push({
        series_name: data[i].querySelector("h3").innerText,
        image_link: data[i].querySelector("img").src,
        link_host_name: "",
        director: "",
        release_year: "",
        release_date_formatted: "",
        video_length: "",
        decsription: "",
        genre: "",
        stars: [],
        language: "",
        url: data[i].querySelector("a").href
      });
    }
    return jsonData;
  });

  // console.log(seriesData[0].link)
  videoDetails = [];
  for (i = 0; i < seriesData.length; i++) {
    // for (i = 0; i < 5; i++) {
    t = seriesData[i].url.split("/")[seriesData[i].url.split("/").length - 1];
    seriesURL = "https://catalogapi.zee5.com/v1/tvshow/" + t + "?translation=en";
    // seriesURL = seriesData[i].url

    //get the season id from the seriesURL use that for https://catalogapi.zee5.com/v1/season/<insert season id here>?asset_subtype=episode&translation=en&sort_by_field=index&sort_order=DESC
    console.log(
      "fetching " + (i + 1) + " of " + seriesData.length + " url: " + seriesURL
    );
    await page.goto(seriesURL);
    await page.waitForSelector("body");
    // await page.waitFor(3000)
    // await page.click('.read')
    const videoData = await page.evaluate(async () => {
      var jsonData = [],
        description = "",
        release_date = "",
        director = "",
        genre = [],
        language = [];
      stars = [];
      data = JSON.parse(document.querySelector("pre").innerText);
    //   if (document.querySelectorAll('.description').length > 0)
    //       description = document.querySelector('.description').innerText
    //   if (document.querySelectorAll('.metadata').length > 0)
    //       // release_date = document.querySelectorAll('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(1) > td:nth-child(2)').innerText
    //       release_date = document.querySelector('.metadata').innerText.trim().split('\n')[0].split('\t')[1]
    //   if (document.querySelectorAll('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(2) > td:nth-child(2)').length > 0)
    //       director = document.querySelector('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText
    //   if (document.querySelectorAll('.title3').length > 0)
    //       genre = document.querySelector('.title3').innerText.split('.')[0].trim()
    //   if (document.querySelectorAll('.title3').length > 0)
    //       language = document.querySelector('.title3').innerText.split('.')[1].trim()

    //   if (document.querySelectorAll('.outer1').length > 0 && document.querySelector('.outer1').querySelectorAll('.title2').length > 0) {
    //   temp = data.actors;
        
      for (s = 0; s < temp.length; s++) {
        stars.push({
          name: temp[s].split(":")[0],
          image_link: ""
        });
      }
      // }
      temp = data.genres;
      for (s = 0; s < temp.length; s++) {
        genre.push(temp[s].value);
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
      temp = data.languages;
      for (s = 0; s < temp.length; s++) {
        language.push(lang_list[temp[s]]);
      }
      jsonData.push({
        url: document.URL,
        description: data.description,
        release_date_formatted: data.release_date,
        director: data.directors,
        genre: genre,
        //'language': document.querySelector('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(5) > td:nth-child(2)').innerText,
        language: language,
        stars: stars
      });
      return jsonData;
    });

    videoDetails.push(videoData);
  }

  for (i = 0; i < seriesData.length; i++) {
    seriesData[i].release_date_formatted =
      videoDetails[i][0].release_date_formatted;
    seriesData[i].description = videoDetails[i][0].description;
    seriesData[i].language = videoDetails[i][0].language;
    seriesData[i].director = videoDetails[i][0].director;
    seriesData[i].genre = videoDetails[i][0].genre;
    seriesData[i].stars = videoDetails[i][0].stars;
  }
  // console.log(videoDetails[0][0].date_published)
  // console.log(seriesData)
  fs.writeFileSync("zee_series.json", JSON.stringify(seriesData));
  await browser.close();
})();
