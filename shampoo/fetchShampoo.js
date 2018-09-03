const puppeteer = require("puppeteer");
const fs = require("fs");

url = 'https://www.ewg.org/skindeep/browse/shampoo/'

totalPages = 9
pagedURLS = []

allData = []

for (i = 0; i < totalPages; i++) {
    pagedURLS[i] = 'https://www.ewg.org/skindeep/browse.php?category=shampoo&atatime=500&&showmore=products&start=' + (500 * (i + 1))
    console.log(pagedURLS[i])
}

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
    for (i = 0; i < pagedURLS.length; i++) {
        // for (i = 0; i < 20; i++) {


        pageURL = pagedURLS[i]
        console.log(i + ' of ' + pagedURLS.length + ' : ' + pageURL)

        await page.goto(pageURL)
        await page.waitForSelector('body');

        var listDetails = await page.evaluate(() => {

            jsonData = []

            data = document.querySelector('#table-browse')
            links = data.querySelectorAll('.product_name_list')
            images = data.querySelectorAll('td:nth-child(2) > a')

            for (j = 0; j < links.length; j++) {
                jsonData.push({
                    itemName: links[j].querySelector('a').innerText,
                    itemLinks: links[j].querySelector('a').href,
                    itemImage: images[j].querySelector('img').src
                })
            }

            return jsonData
        })
        console.log(listDetails)


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
        allData = allData.concat(listDetails)

    }



    fs.writeFileSync('test.json', JSON.stringify(allData, null, 2))
    await browser.close();
})();