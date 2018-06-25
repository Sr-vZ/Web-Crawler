const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

url = "https://demo.pulsarplatform.com/admin/sessions/sign_in"; //sign in url;
searchURL = 'https://demo.pulsarplatform.com/admin/trends/custom_searches' //search url

userName = 'mashraf@email.arizona.edu';
pass = 'Password123';

searcTerms = ['msft', 'aapl', 'amzn'];

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto(url);
    await page.waitForSelector("body");

    if (await page.$("input[type='email']") !== null) {
        // console.log('found')
        await page.focus("input[type='email']")
        await page.type("input[type='email']", userName)
        await page.focus("input[type='password']")
        await page.type("input[type='password']", pass)
        await page.click("button")
        await page.waitForNavigation()
        // await page.waitForSelector('body')
    } else {
        console.log('not found')
    }

    searchSelector = '#pulsar-custom_searches > div.page > div > div:nth-child(1) > div > div:nth-child(1) > div > div > div > a'
    locationSelector = '#pulsar-custom_searches > div.page > div > div:nth-child(1) > div > div:nth-child(2) > div > div.dropdown.col-sm-4.pad-md-y > a'
    worldwide = '#countries-select-container > li.dm-area > ul > li:nth-child(1) > a'
    dateSelector = '#pulsar-custom_searches > div.page > div > div:nth-child(1) > div > div:nth-child(2) > div > div.col-sm-7.pad-md-y.js-daterangepicker-container.daterangepicker-bottom.daterangepicker-noarrow.daterangepicker-notime > div.text-link.ly-inline-block > a'
    last12months = '#pulsar-custom_searches > div.page > div > div:nth-child(1) > div > div:nth-child(2) > div > div.col-sm-7.pad-md-y.js-daterangepicker-container.daterangepicker-bottom.daterangepicker-noarrow.daterangepicker-notime > div.daterangepicker.dropdown-menu.ltr.show-calendar.opensright > div.ranges > ul > li:nth-child(4)'
    viewResults = '#pulsar-custom_searches > div.page > div > div:nth-child(1) > div > div:nth-child(2) > div > div.col.ml-auto > button'
    // await page.waitFor(10000)
    standardTrends = '#pulsar-launchpad > div.site-header > div.navbar.navbar-inverse.navbar-static-top > nav > ul > li:nth-child(1) > a'
    await page.waitFor(standardTrends)
    await page.click(standardTrends)
    await page.waitForSelector('.input-group')
    // await page.goto(searchURL)
    customTrends = '#pulsar-standard_trends > div.page > div > div:nth-child(6) > div > div:nth-child(1) > div > div > a'
    await page.waitFor(customTrends)
    await page.click(customTrends)

    await page.waitForSelector('body')
    // await page.waitForNavigation()
    await page.waitFor(2000)
    await page.waitForSelector(searchSelector)

    if (await page.$(searchSelector) !== null) {
        console.log('custom search found!')
        await page.click(searchSelector)
        await page.waitFor(500)
        await page.keyboard.type(searcTerms[0])
        page.keyboard.press(String.fromCharCode(13)) //simulates enter key
        await page.waitFor(500)
        await page.click(locationSelector)
        await page.click(worldwide)
        await page.waitFor(500)
        await page.click(dateSelector)
        await page.waitForSelector('#pulsar-custom_searches > div.page > div > div:nth-child(1) > div > div:nth-child(2) > div > div.col-sm-7.pad-md-y.js-daterangepicker-container.daterangepicker-bottom.daterangepicker-noarrow.daterangepicker-notime > div.daterangepicker.dropdown-menu.ltr.show-calendar.opensright')
        await page.waitFor(500)
        await page.click(last12months)
        await page.waitFor(500)
        await page.click(viewResults)
        // await page.waitForNavigation()


    } else {
        console.log('custom search not loaded!')
    }
    console.log("Scrolling through page");
    await page.waitFor(20000)




    // await browser.close();
})();