const puppeteer = require('puppeteer');

url = "http://www.hungama.com/tv-show/motorcycle-experience/20835799/";

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    seasons = []
    await page.goto(url);
    await page.waitForSelector('.ttl')
    //await page.click('');
    //await page.waitFor(1000);

    const result = await page.evaluate(() => {
        let seasonsSel = document.querySelector("#show_details").querySelectorAll("#pajax_a");
        //for(i=0;i<seasons.length;i++)


        return seasonsSel;

    })
    for(i=0;i<result.length;i++){
        await page.click(result[i])
        const data =await page.evaluate(()=>{
            if (document.querySelectorAll(".song-name").length > 0)
                epObj = document.querySelectorAll(".song-name")

            for (j = 0; j < epObj.length; j++) {
            
                    episodes.push({
                      season: result[i].innerText,
                      // episode_name: ep_name,
                      // episode_url: ep_link
                      episode_name: epObj[j].title,
                      episode_url: epObj[j].href
                    });
                  }
             jsonData.push({
              "url": document.URL,
              "title": document.querySelector(".ttl").innerHTML,
              "episode_details": episodes
            });
            
            return jsonData;
        })
    }
    browser.close();
    //return result;
};

scrape().then((value) => {
    console.log(value); // Success!
});