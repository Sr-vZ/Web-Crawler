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
        headless: false
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
    start = 0 //250
    // end = 3567
    end = 500 //
    // for (i = 0; i < shampooLinks.length; i++) {
        // for (i = 0; i < 20; i++) {
        for(i=start;i<end;i++){

        shampooLink = shampooLinks[i]
        shampooName = shampooList[i].itemName
        shampooImg = shampooList[i].itemImage
        console.log(i + ' of ' + shampooLinks.length + ' : ' + shampooLink)

        await page.goto(shampooLink)
        await page.waitForSelector('body');
        await page.waitFor(1500)
        var shampooDetails = await page.evaluate((shampooLink, shampooName, shampooImg) => {

            jsonData = []

            // data = document.querySelector('#table-browse')
            // links = data.querySelectorAll('.product_name_list')
            // images = data.querySelectorAll('td:nth-child(2) > a')
            ingredientConcerns = []
            table = []
            concernCat = document.querySelectorAll('.individualbar_3col')
            concernVal = document.querySelectorAll('.basic_bar')

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
            
            if (document.querySelector('.product_tables')) {
                datatable = document.querySelector('.product_tables').querySelectorAll('tr')

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
            }
            overallScore = 0
            if (document.querySelector('.scoretextbg').querySelector('img')) {
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


        
        allData = allData.concat(shampooDetails)

    }



    fs.appendFileSync('Shampoo_data.json', JSON.stringify(allData, null, 2))
    await browser.close();
})();