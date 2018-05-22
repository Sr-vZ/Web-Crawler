const Nick = require("nickjs") 
const nick = new Nick();
(async () => {
    const tab = await nick.newTab()
    await tab.open("news.ycombinator.com")
    await tab.untilVisible("#hnmain")
    // Make sure we have loaded the page 
    await tab.inject("../injectables/jquery-3.0.0.min.js")
    // We're going to use jQuery to scrape 
    const hackerNewsLinks = await tab.evaluate((arg, callback) => {
        // Here we're in the page context. It's like being in your browser's inspector tool 
        const data = []
        $(".athing").each((index, element) => {
            data.push({
                title: $(element).find(".storylink").text(),
                url: $(element).find(".storylink").attr("href")
            })
        })
        callback(null, data)
    })
    console.log(JSON.stringify(hackerNewsLinks, null, 2))
})().then(() => {
    console.log("Job done!")
    nick.exit()
}).catch((err) => {
    console.log(`Something went wrong: ${err}`)
    nick.exit(1)
})