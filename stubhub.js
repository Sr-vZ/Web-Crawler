const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");
const randomUA = require("modern-random-ua");

url = "https://www.stubhub.com/metlife-stadium-tickets/venue/174027"; //sample url

priceURL = 'https://api.stubhub.com/search/inventory/v2/?eventId=103569695'
eventURL = "https://api.stubhub.com//catalog/events/v3/103569695";



(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setUserAgent(randomUA.generate());
  await page.goto(url);
  await page.waitFor(5000);

  console.log("Openeing the page");

  if ((await page.$(".EventListPanel__Footer")) !== null){
    await page.click(".EventListPanel__Footer");
  }
  const eventLinks = await page.evaluate(() => {
    links = [];
    temp = document.querySelectorAll(".EventRedirection");
    for (i = 0; i < temp.length; i++) {
      links.push(temp[i].querySelector("a").href);
    }

    return links;
  });
  console.log(eventLinks);
  fs.writeFileSync("stubhub.json", JSON.stringify(eventLinks));
  await browser.close();
})();