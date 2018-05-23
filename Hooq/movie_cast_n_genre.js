const fs = require('fs')
const Nightmare = require("nightmare");
const nightmare = Nightmare({
  show: false,
  //cookiesFiles: "./cookie.txt"
  webPreferences: {
    partition: "persist: testing"
  }
});



var obj = JSON.parse(fs.readFileSync("hooq_movies.json"));

movieURLs = []

for (i = 0; i < obj.length; i++) {
  movieURLs[i] = obj[i].url
}

console.log(movieURLs)

response = []
async function main() {
  response = [];
  //   for (i = 0; i < 144; i++) {
  //     jsonUrl[i] =
  //       "https://www.hooq.tv/search?page=" +
  //       (i + 1) +
  //       "&size=18&scope=min%2Cimages&as=MOVIE";
  //   }

  //   var nightmare = Nightmare({ show: true })

  for (let i = 0; i < movieURLs.length; i++) {
    const url = movieURLs[i] //.replace(';autoplay=1','');
    const title = await nightmare
      .useragent(
        "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
      )
      .goto(url)
      .wait("body")
      .evaluate(() => {
        data = []
        stars ='',director='',genre='',lang='';

        if(document.querySelectorAll("div.tr:nth-child(5) > div:nth-child(2)").length>0)
          stars = document.querySelector("div.tr:nth-child(5) > div:nth-child(2)").innerText
        if(document.querySelectorAll("div.tr:nth-child(4) > div:nth-child(2)").length>0)
          director = document.querySelector("div.tr:nth-child(4) > div:nth-child(2)").innerText
        if(document.querySelectorAll("div.title-links:nth-child(4)").length>0)
          genre = document.querySelector("div.title-links:nth-child(4)").innerText
        if(document.querySelectorAll('#card-description > div > div.tbl > div:nth-child(2) > div:nth-child(2)').length>0)
          lang = document.querySelector('#card-description > div > div.tbl > div:nth-child(2) > div:nth-child(2)').innerText
        data.push({
          url: document.URL,          
          stars: stars,
          director: director,
          genre: genre,
          lang: lang
        });

        return data
      })
      .then(result => {
        //data = JSON.parse(result).data;

        response.push(result);

        fs.appendFileSync("hooq_movie_castngenre.json", JSON.stringify(result));
        console.log(url);
      })
      .catch(error => {
        console.error("Failed:", error);

      });

    //console.log(url);
  }
  fs.writeFileSync("hooq_movie_cast.json", JSON.stringify(response));
  await nightmare.end();
}

main().catch(console.error);