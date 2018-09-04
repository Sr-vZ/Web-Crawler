const puppeteer = require("puppeteer");
const fs = require("fs");


shampooList = JSON.parse(fs.readFileSync('shampooList.json'))
shampooLinks = []
for (i = 0; i < shampooList.length; i++) {
    shampooLinks[i] = shampooList[i].itemLinks
}
allData = []
url = shampooLinks[0];

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)
    // let lastRedirectResponse = undefined;
    // page.setRequestInterception(true);

    // page.on('response', response => {
    //     // if this response is a redirect
    //     if ([301, 302, 303, 307, 308].includes(response.status) &&
    //         response.request().resourceType === 'document') {
    //         lastRedirectResponse = response;
    //     }
    // });

    // page.on('request', interceptedRequest => {
    //     // if this request is the one related to the lastRedirect
    //     if (lastRedirectResponse &&
    //         lastRedirectResponse.headers.location === interceptedRequest.url) {
    //         interceptedRequest.abort();
    //     }
    // });


    await page.goto(url);
    await page.waitForSelector('body')

    // console.log('Scrolling through page');

    // await autoScroll(page);
    // const jsonOutput = await page.evaluate(() => {
    //     data = JSON.parse(document.querySelector('pre').innerText)

    //     return data
    // })
    // for (i = 0; i < shampooLinks.length; i++) {
        for (i = 0; i < 20; i++) {


        shampooLink = shampooLinks[i]
        shampooName = shampooList[i].itemName
        shampooImg = shampooList[i].itemImage
        console.log(i + ' of ' + shampooLinks.length + ' : ' + shampooLink)

        await page.goto(shampooLink)
        await page.waitForSelector('body');

        var shampooDetails = await page.evaluate((shampooLink, shampooName, shampooImg) => {

            jsonData = []

            // data = document.querySelector('#table-browse')
            // links = data.querySelectorAll('.product_name_list')
            // images = data.querySelectorAll('td:nth-child(2) > a')
            ingredientConcerns = []
            table = []
            concernCat = document.querySelectorAll('.individualbar_3col')
            concernVal = document.querySelectorAll('.basic_bar')
            datatable = document.querySelector('.product_tables').querySelectorAll('tr')
            for (j = 0; j < concernVal.length; j++) {
                ingredientConcerns.push({
                    'Concern Criteria': concernCat[j].querySelector('.individualbar_col1').innerText,
                    'Concern Score': parseFloat(parseFloat(concernVal[j].style.width.replace('px', '')) * 100 / 190)
                })

            }
            imgScore = [
                "https://static.ewg.org/skindeep/img/draw_score/score_image0__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image1__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image2__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image3__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image4__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image5__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image6__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image7__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image8__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image9__1_.png",
                "https://static.ewg.org/skindeep/img/draw_score/score_image10__1_.png",
            ]
            for (j = 1; j < datatable.length; j++) {
                Ingredient = ''
                if (datatable[j].querySelector('.firstcol')) {
                    Ingredient = datatable[j].querySelector('.firstcol').innerText
                }
                Score = 0
                if (datatable[j].querySelector('td:nth-Child(3)').querySelector('img')) {
                    Score = imgScore.indexOf(datatable[j].querySelector('td:nth-Child(3)').querySelector('img').src)
                }
                Concerns = ''
                if (datatable[j].querySelector('td:nth-Child(2)')) {
                    Concerns = datatable[j].querySelector('td:nth-Child(2)').innerText
                }
                Data = ''
                if (datatable[j].querySelector('td:nth-Child(3)').querySelector('span')) {
                    Data = datatable[j].querySelector('td:nth-Child(3)').querySelector('span').innerText
                }

                table.push({
                    Ingredient: Ingredient,
                    Concerns: Concerns,
                    Score: Score,
                    Data: Data
                })
            }

            overallScore = 0
            if(document.querySelector('.scoretextbg').querySelector('img')){
                overallScore = imgScore.indexOf(document.querySelector('.scoretextbg').querySelector('img').src)
            }
            jsonData.push({
                'Product Name': shampooName,
                'Product Image': shampooImg,
                'Product Link': shampooLink,
                'Overall Score': overallScore,
                'Overall Concerns': ingredientConcerns,
                'Ingredient Scores': table
            })
            return jsonData
        }, shampooLink, shampooName, shampooImg)
        console.log(shampooDetails)


        // jsonData.push({

        //     series_name: seriesDetails[i].series_name, // String | For anime name,
        //     title: seriesDetails[i].title, //String | For episode title,
        //     // language: language, //String | For language of this anime,
        //     episode_number: seriesDetails[i].episode_number, //Integer | For episode number
        //     season_name: seriesDetails[i].season_name, //String | Should be formatted like Season 1, Season 2.
        //     release_date_formatted: seriesDetails[i].release_date_formatted, //String | If full date is available then only this parameter should be used. Format - %d-%B-%Y - for ex: 17-May-2018, 23-November-2018, 02-December-2018.
        //     release_year: seriesDetails[i].release_year, //Integer | Many times only release year is present. Should be only used if only release year data is available and not full date. Either use release_year or release_date_formatted.
        //     synopsis: seriesDetails[i].synopsis, //String | Episode synopsis
        //     link: seriesDetails[i].link, //String | Episode link
        //     series_link: seriesDetails[i].series_link, //String | If anime link is different then episode link.
        //     video_length: seriesDetails[i].video_length, //Integer | In seconds. Always convert the episode length to time in seconds.
        //     image_link: seriesDetails[i].image_link, //String | episode image link.
        //     stars: castDetails.cast, //Array of Dictionary: [{"name": "Actor name", "image_link": "Actor image link if available"}].
        //     directors: castDetails.directors //Array of string | If multiple director names available.
        //     // director: director //String | If only one director name is available.

        // })
        allData = allData.concat(shampooDetails)

    }



    fs.writeFileSync('test.json', JSON.stringify(allData, null, 2))
    await browser.close();
})();