const fs = require('fs')

const Nightmare = require("nightmare");
const nightmare = Nightmare({
    show: true,
    //cookiesFiles: "./cookie.txt"
    webPreferences: {
        partition: 'persist: testing'
    }
});
vo = require('vo')


var obj = JSON.parse(fs.readFileSync('hooq_tv_test.json'))

console.log(obj[0][0].id)
tvURLs = []

for (i = 0; i < obj.length; i++) {
    for (j = 0; j < obj[i].length; j++) {

        tvURLs.push("https://www.hooq.tv/catalog/" + obj[i][j].id + "?__sr=feed");
        console.log(obj[i][j].id);
    }
}
console.dir(tvURLs)

async function main() {
    response = [];
    for (let i = 0; i < tvURLs.length; i++) {
        const url = tvURLs[i]; //.replace(';autoplay=1','');
        const title = await nightmare
            .useragent(
                "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
            )
            .goto(url)
            .wait("body")
            .evaluate(() => {
                data = []
                if (document.querySelectorAll('#topDescription').length > 0) {
                    lang = document.querySelector('#topDescription').innerText.split('|')[2]
                    //lang = document.querySelector("div.tr:nth-child(2) > div:nth-child(2)").innerText;
                } else {
                    lang = ""
                }
                if (document.querySelectorAll("#title-details > div.row.row-eq-height > div > div.col-xs-12.col-lg-4 > div > div.card-block.col-sm-8.col-lg-12 > div.tbl > div:nth-child(3) > div:nth-child(2)").length > 0) {
                    director = document.querySelector("#title-details > div.row.row-eq-height > div > div.col-xs-12.col-lg-4 > div > div.card-block.col-sm-8.col-lg-12 > div.tbl > div:nth-child(3) > div:nth-child(2)").innerText;
                } else {
                    director = ""
                }
                if (document.querySelectorAll("#title-details > div.row.row-eq-height > div > div.col-xs-12.col-lg-4 > div > div.card-block.col-sm-8.col-lg-12 > div.tbl > div:nth-child(4) > div:nth-child(2)").length > 0) {
                    stars = document.querySelector("#title-details > div.row.row-eq-height > div > div.col-xs-12.col-lg-4 > div > div.card-block.col-sm-8.col-lg-12 > div.tbl > div:nth-child(4) > div:nth-child(2)").innerText;
                } else {
                    stars = ""
                }
                if (document.querySelectorAll(".season-number-list").length > 0) {
                    temp = document
                        .querySelector(".season-number-list")
                        .querySelectorAll("a");
                    seasons = [];
                    for (k = 0; k < temp.length; k++) {
                        seasons[k] = temp[k].innerText;
                    }
                } else {
                    seasons = []
                }

                if (document.querySelectorAll("div.title-links:nth-child(4)").length > 0)
                    genre = document.querySelector("div.title-links:nth-child(4)").innerText

                data.push({
                    language: lang,
                    director: director,
                    stars: stars,
                    seasons: seasons,
                    url: document.URL,
                    genre: genre
                })
                return data;
            })
            .then(result => {
                response.push(result);
                fs.appendFileSync("tv_data_dump.json", JSON.stringify(result));
                console.log(i + " of " + tvURLs.length + " " + url);
            })
            .catch(error => {
                console.error("Failed:", error);
            });

        //console.log(url);
    }
    fs.writeFileSync("tv_data.json", JSON.stringify(response));
    await nightmare.end();
}

main().catch(console.error);