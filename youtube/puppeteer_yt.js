const puppeteer = require('puppeteer');
const _ =require('lodash')

url = 'https://www.youtube.com/channel/UCNJcSUSzUeFm8W9P7UUlSeQ/videos'; //tvf link;

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body')

    console.log('Scrolling through page');

    // await autoScroll(page);

    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            try {
                const maxScroll = Number.MAX_SAFE_INTEGER;
                let lastScroll = 0;
                const interval = setInterval(() => {
                    window.scrollBy(0, 100);
                    const scrollTop = document.documentElement.scrollTop;
                    if (scrollTop === maxScroll || scrollTop === lastScroll) {
                        clearInterval(interval);
                        resolve();
                    } else {
                        lastScroll = scrollTop;
                    }
                }, 50);
            } catch (err) {
                console.log(err);
                reject(err.toString());
            }
        });
    });
    // console.log('Dimensions:', dimensions);
    const channeldata = await page.evaluate(() => {
        jsonData = []
        data = document.querySelectorAll('#dismissable')

        for (i = 0; i < data.length; i++) {
            jsonData.push({
                "channel_link": data[i].URL,
                "image_link": data[i].querySelector('img').src,
                "link": data[i].querySelector('#video-title').href,
                "heading": data[i].querySelector('#video-title').title,
                "video_length": data[i].querySelector('#overlays').innerText.trim(),
                "date_published": data[i].querySelector('#metadata-line').innerText.trim().split('\n')[1],
                "description": ''
            })
        }
        return jsonData
    })

    // console.log(channeldata[0].link)
    videoDetails =[]
    for (i = 0; i < channeldata.length; i++) {
        videoURL = channeldata[i].link
        console.log('fetching '+(i+1)+' of '+channeldata.length+' url: '+videoURL)
        await page.goto(videoURL)
        await page.waitFor(2000)
        const videoData = await page.evaluate(() => {
            var jsonData = [],
                description = '';

            if (document.querySelectorAll('#description').length > 0)
                description = document.querySelector('#description').innerText

            jsonData.push({
                'url': document.URL,
                'description': description,
                'date_published': document.querySelector('.date').innerText.replace('Published on ', '')
            });
            return jsonData;
        })
        
        videoDetails.push(videoData)
    }

    for (i = 0; i < channeldata.length; i++) {
        
            channeldata[i].date_published = videoDetails[i][0].date_published
            channeldata[i].description = videoDetails[i][0].description
        
    
    }
    console.log(videoDetails[0][0].date_published)
    console.log(channeldata)
    await browser.close();
})();