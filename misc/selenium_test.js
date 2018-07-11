var webdriver = require("selenium-webdriver"),
  By = require("selenium-webdriver").By,
  until = require("selenium-webdriver").until;

const firefox = require("selenium-webdriver/firefox");
const firefoxPath =
  "./geckodriver.exe";

// const binary = new firefox.Binary(
//   "C://Users//608619925//Downloads//FirefoxPortable64-59.0.3//FirefoxPortable64//FirefoxPortable.exe"
// );
//   binary.addArguments("--headless");

var builder = new webdriver.Builder().forBrowser("firefox");
builder.setFirefoxOptions(new firefox.Options().setBinary(firefoxPath));


var driver = builder.build();

// const driver = new Builder()
//   .forBrowser("firefox")
//   .setFirefoxOptions(new firefox.Options().setBinary(binary))
//   .build();
url = "http://www.hungama.com/tv-show/motorcycle-experience/20835799/";

driver.get(url);
// driver.sleep(2000)
driver.findElement(By.className("tvshow")).click()
// driver.findElements(By.id("pajax_a")).then(function (element) {
//     console.log(element)
    
// });
// //driver.findElement(By.id("login_submit")).click();

// // driver.findElement(By.linkText("Settings")).then(
// //   function(element) {
// //     console.log("Yes, found the element");
// //   },
// //   function(error) {
// //     console.log("The element was not found, as expected");
// //   }
// // );

driver.quit();

// async function test() {
//     try {
//     await driver.get('http://www.google.com/ncr');
//     await driver.findElement(By.name('q'));
//     await driver.sendKeys('webdriver', Key.RETURN);
//     await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
//   } finally {
//     await driver.quit();
//   }

// }

// test()