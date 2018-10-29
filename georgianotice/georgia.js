const puppeteer = require("puppeteer");
const fs = require("fs");
allData = [];
url = 'https://www.georgiapublicnotice.com/Search.aspx';

(async () => {

    const browser = await puppeteer.launch({
        headless: false
    });
    // var url = 'https://www.zee5.com/movies/all'; //zee movies all;
    const page = await browser.newPage();
    // const page2 = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)



    await page.goto(url);
    await page.waitForSelector('body')
    await page.click('#ctl00_ContentPlaceHolder1_as1_btnGo')





    // pageURL = pagedURLS[i]
    // console.log(i + ' of ' + pagedURLS.length + ' : ' + pageURL)

    // await page.goto(pageURL)
    // await page.waitForSelector('body');
    await page.waitFor(5000)
    await page.waitForSelector('body')
    await page.waitFor(5000)
    var listDetails = await page.evaluate(() => {

        jsonData = []
        linkList =[]
        // data = document.querySelector('#table-browse')
        // links = data.querySelectorAll('.product_name_list')
        // images = data.querySelectorAll('td:nth-child(2) > a')
        links = document.querySelectorAll('.viewButton')

        for (j = 0; j < links.length; j++) {
            properLink = 'https://www.georgiapublicnotice.com/' + links[j].getAttribute('onclick').replace("javascript:location.href='", "").replace("';return false;", "")
            jsonData.push({
                link: properLink
            })
            linkList.push(properLink)
        }

        return linkList
    })
    console.log(listDetails)
    for (i = 0; i < listDetails.length;i++){
        viewUrl = listDetails[i]
        await page.goto(viewUrl);
        await page.waitForSelector('body')
        await page.waitFor(5000)

        var viewDetails = await page.evaluate(() => {
            jsonData = []
            
            jsonData.push({
                title: document.querySelector('#ctl00_ContentPlaceHolder1_PublicNoticeDetailsBody1_PublicNoticeDetails1_lblPubName1').innerText,
                date: document.querySelector('#ctl00_ContentPlaceHolder1_PublicNoticeDetailsBody1_lblPublicationDAte').innerText,
                notice_content: document.querySelector('#ctl00_ContentPlaceHolder1_PublicNoticeDetailsBody1_lblContentText').innerText
            })
            

            return jsonData
        })

        allData = allData.concat(viewDetails)
    }


    // allData = allData.concat(listDetails)





    fs.writeFileSync('test.json', JSON.stringify(allData, null, 2))
    await browser.close();
})();