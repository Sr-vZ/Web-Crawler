/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const puppeteer = require('puppeteer');
let page;

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  return browser.newPage();
}

exports.hotstar = (req, res) => {
 url = 'https://www.hotstar.com/movies/languages/hindi'
  
  if (!page) {
    page = await getBrowserPage();
  }
  
  await page.goto(url);
  await page.waitForSelector('body')
  for (i = 0; i < 30; i++) {
            await page.evaluate('window.scrollBy(0, document.body.scrollHeight)')
            await page.waitFor(1000)
            await page.evaluate('window.scrollTo(0, 0)')
        }
  var movieDetails = await page.evaluate(() => {
            jsonData = []
            data = document.querySelectorAll('article')
            for (m = 0; m < data.length; m++) {
                free = true
                if (data[m].querySelector('.badge')) {
                    free = false
                }
                movie_url = data[m].querySelector('a').href

                jsonData.push({
                    title: data[m].querySelector('span').innerText,
                    link: movie_url,
                    is_free: free
                })
            }

            return jsonData
        })
  //await browser.close();
  res.set("Content-Type",'application/json');
  res.send(JSON.stringify(movieDetails));
};
