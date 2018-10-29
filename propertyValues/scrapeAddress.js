const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

url = "https://keyrentersaltlake.com/salt-lake-homes-for-rent/"; //sign in url;
zillowAPi = 'https://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz18afvtrhxxn_6a5jo';
// searchURL = 'https://demo.pulsarplatform.com/admin/trends/custom_searches' //search url


(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1366, height: 768});
    await page.goto(url);
    await page.waitForSelector("body");
    await page.waitFor(5000);

    var propertyDetails = await page.evaluate(() => {
        jsonData = []

        data = document.querySelectorAll('.tt-rental-row.search-is-visible.filter-is-visible')
        for (i = 0; i < data.length; i++) {
            jsonData.push({
                address: data[i].querySelector('.rental-address').innerText.split('\n')[0],
                cityzip: data[i].querySelector('.rental-address').innerText.split('\n')[1]
            })

        }
        return jsonData
    })
    console.log(propertyDetails[0].address)

    for (i = 0; i < propertyDetails.length; i++) {
        console.log(i + ' / ' + propertyDetails[i])
        detailURL = zillowAPi + '&address=' + propertyDetails[i].address + '&citystatezip=' + propertyDetails[i].cityzip

        await page.goto(detailURL);
        await page.waitForSelector("body");
        // await page.waitFor(5000);
        var propertyValues = await page.evaluate(() => {
            jsonData = []

            // data = document.querySelectorAll('.tt-rental-row.search-is-visible.filter-is-visible')
            if (parseInt(document.querySelector('message>code').innerHTML) === 0) {
                if (document.querySelector('address')) {
                    street = document.querySelector('address>street').innerHTML
                    city = document.querySelector('address>city').innerHTML
                    state = document.querySelector('address>state').innerHTML
                    zip = document.querySelector('address>zipcode').innerHTML
                    latitude = document.querySelector('address>latitude').innerHTML
                    longitude = document.querySelector('address>longitude').innerHTML
                } else {
                    street = ''
                    city = ''
                    state = ''
                    zip = ''
                    latitude = ''
                    longitude = ''
                }
                jsonData.push({

                    street: street,
                    city: city,
                    state: state,
                    zip: zip,
                    latitude: latitude,
                    longitude: longitude,
                    valuation_range: "$ " + document.querySelector('valuationRange>low ').innerHTML + " - " + document.querySelector('valuationRange>high ').innerHTML,
                    current_valuation: "$ " + document.querySelector('zestimate>amount ').innerHTML

                })
            }



            return jsonData
        })
        fs.appendFileSync('propertyDetails.json', JSON.stringify(propertyValues, null, 2))
    }




    await browser.close();
})();