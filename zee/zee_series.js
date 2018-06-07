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
          window.scrollBy(0, 200);
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
        season_name: "",
        title: "",
        director: "",
        release_year: "",
        release_date_formatted: "",
        video_length: "",
        synopsis: "",
        video_length: "",
        genre: "",
        stars: [],
        language: "",
        url: data[i].querySelector("a").href
      });
    }
    return jsonData;
  });
  fs.writeFileSync('zee_series.json',JSON.stringify(seriesData))
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
    const episodeData = await page.evaluate(async () => {
      var jsonData = [],
        description = "",
        release_date = "",
        director = "",
        genre = [],
        language = [];
        seasons=[]
      stars = [];
      data = JSON.parse(document.querySelector("pre").innerText);
      temp = data.actors;
        
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
      temp = data.seasons
      for (s = 0; s < temp.length; s++) {
        seasons.push({
          season_id: temp[s].id,
          season_title: temp[s].title
        });
      }
      jsonData.push({
        url: document.URL,
        description: data.description,
        release_date_formatted: data.release_date,
        director: data.directors,
        genre: genre,
        //'language': document.querySelector('#body > app-root > div > app-movie-details > div.outerContainer > div.titleContainer > div.metadata > table > tbody > tr:nth-child(5) > td:nth-child(2)').innerText,
        language: language,
        stars: stars,
        seasons: seasons
      });
      return jsonData;
    });

    videoDetails.push(episodeData);
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

  for(i=0;i<videoDetails.length;i++){
    for(j=0;j<videoDetails[i][0].seasons.length;j++){
      season_id=videoDetails[i][0].seasons[j].season_id
      seasonURL ='https://catalogapi.zee5.com/v1/season/'+season_id+'?asset_subtype=episode&translation=en&sort_by_field=index&sort_order=DESC&page_size=100'
      console.log(
      "fetching " + (i + 1) + " of " + videoDetails.length + " url: " + seasonURL
    );
    await page.goto(seasonURL);
    await page.waitForSelector("body")
    const episodeData = await page.evaluate(async () => {
      data = JSON.parse(document.querySelector("pre").innerText);
      jsonData =[]
      for(k=0;k<data.episodes.length;k++){
        genre = []
        temp = data.episodes[k].genres;
        for (s = 0; s < temp.length; s++) {
          genre.push(temp[s].value);
        }
        jsonData.push({
          series_name: data.title,
          image_link:
            "https://akamaividz.zee5.com/resources/" +
            data.episodes[k].id +
            "/list/270x152/" +
            data.episodes[k].image.list,
          season_name: data.title.split("-")[1],
          title: data.episodes[k].title,
          director: data.episodes[k].directors,
          release_year: "",
          episode_number: data.episodes[k].index,
          release_date_formatted:data.episodes[k].release_date,
          video_length:data.episodes[k].duration,
          synopsis: data.episodes[k].description,
          genre: genre,
          stars:  data.episodes[k].actors,
          language: "",
          url: 'https://zee5vod.akamaized.net'+data.episodes[k].url
        });

      }
      return jsonData
    })
    fs.appendFileSync("zee_episodes.json", JSON.stringify(episodeData));
    }
  }




  await browser.close();
})();

