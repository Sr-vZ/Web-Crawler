var fs = require("fs");
var _ = require("lodash");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
    show: true,
    //cookiesFiles: "./cookie.txt"
    webPreferences: {
        partition: 'persist: testing'
      }
});
vo = require('vo'),
    nightmare2 = Nightmare();
  

cookieJar = JSON.parse(fs.readFileSync('hooq_nmjs_cookie.json', 'utf8'))

console.log(cookieJar)

// for (var key in cookieJar) {
//     console.log(key + " " + cookieJar[key]);
//     value = 'null'
//     if (cookieJar[key]) {
//         key = cookieJar[key].split(" ")[0]
//         value = cookieJar[key].split(" ")[1]
//     }
//     nightmare.cookies.set(key, value);
// }

url = "https://www.hooq.tv/catalog/073aeadb-6a8a-4743-8ac5-64903a84e94f?__sr=feed&amp";

cookieJar =
[
    {
        "domain": ".hooq.tv",
        "expirationDate": 1590034510,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "GA1.2.544697457.1526526814",
        "id": 1
    },
    {
        "domain": ".hooq.tv",
        "expirationDate": 1527048910,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_gid",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "GA1.2.1541664457.1526958899",
        "id": 2
    },
    {
        "domain": ".hooq.tv",
        "expirationDate": 1526964303,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_uetsid",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "_uetbc4af278",
        "id": 3
    },
    {
        "domain": ".hooq.tv",
        "expirationDate": 1558062813,
        "hostOnly": false,
        "httpOnly": false,
        "name": "ajs_anonymous_id",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "%22047bd191-057c-4450-aa33-72a27a6900e2%22",
        "id": 4
    },
    {
        "domain": ".hooq.tv",
        "expirationDate": 1558498503,
        "hostOnly": false,
        "httpOnly": false,
        "name": "ajs_group_id",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "null",
        "id": 5
    },
    {
        "domain": ".hooq.tv",
        "expirationDate": 1558498503,
        "hostOnly": false,
        "httpOnly": false,
        "name": "ajs_user_id",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "%22002254d8-b197-46d6-8a2c-b74647d9f9d7%22",
        "id": 6
    },
    {
        "domain": "www.hooq.tv",
        "expirationDate": 1527048903.667265,
        "hostOnly": true,
        "httpOnly": true,
        "name": "nebula.sid",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "uP0SZtOBFHsGV5Gdb0-X5uxf8ofKL7PS",
        "id": 7
    },
    {
        "domain": "www.hooq.tv",
        "expirationDate": 1527048903.667322,
        "hostOnly": true,
        "httpOnly": true,
        "name": "nebula.sid.sig",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "tTY5KJ6k_-CtKVDXfgwM8hN1e5M",
        "id": 8
    }
    ]
// nightmare
//   .goto("about:blank")
//   .then(() => {
//     for (var i = 0; i < cookieJar.length; i++) {
//       console.log(cookieJar[i].name + " " + cookieJar[i].value);
//       nightmare.cookies
//         .set({
//           name: cookieJar[i].name,
//           value: cookieJar[i].value,
//         //   path: cookieJar[i].path,
//         //   secure: cookieJar[i].secure,
//         //   httpOnly: cookieJar[i].httpOnly,
//         //   session: cookieJar[i].session
//         })
//         // .goto(url)
//         // //.cookies.get()
//         // .then(cookies => {
//         //   console.log(cookies);
//         //   fs.writeFileSync("hooq_nmjs_cookie", JSON.stringify(cookies));
//         // });
//     }
//   })
  
// cookieJar =
//   "ajs_user_id=null; ajs_group_id=null; ajs_anonymous_id=%22047bd191-057c-4450-aa33-72a27a6900e2%22; _ga=GA1.2.544697457.1526526814; _gid=GA1.2.1681934321.1526526814; _uetsid=_uet085eb6db";

// cookies = cookieJar.split(';')
// console.log(cookies.length)
// names=[],values=[]


// for(i=0;i<cookies.length;i++){
//     names[i] = cookies[i].split('=')[0]
//     values[i] = cookies[i].split('=')[1]
//     nightmare.cookies.set(names[i], values[i])
// }

// console.log(names,values)
//nightmare.cookies.set(cookieJar)

// nightmare.cookies.set({

// });

// var storedCookies = require('./hooq_nmjs_cookie.json')

// nightmare.goto('about:blank'); 

// for(var i = 0; i < storedCookies.length; i++){
//   nightmare.cookies.set(storedCookies[i].name, storedCookies[i].value)
// }

url = "https://www.hooq.tv/verify/email?h=eyJvdHAiOiI1NTE0NjgiLCJoYXNoIjoiM2I2ZUlja2hzTkZsQnpPVFUwWGVSWHArWldVPSIsInNpZ25hdHVyZSI6IjE0MzVjM2QwMGY4ODM1ODEwYjhjMjc2NjE1ZWYyMmFjZDhjOTI0NmI3N2QxOTM3MWYxZmFmMDIyMDkwNTJhZGMiLCJlbWFpbCI6ImhvZ2F5b21lcGlAYjJieC5uZXQiLCJjb3VudHJ5IjoiSU4iLCJhY3Rpb24iOiJzaWdudXAifQ=="
url =
  "https://www.hooq.tv/catalog/073aeadb-6a8a-4743-8ac5-64903a84e94f?__sr=feed&amp"
url = "https://www.hooq.tv/in/login-email"
//url = "https://www.hooq.tv/search?page=2&size=18&scope=min%2Cimages&as=MOVIE"

jsonUrl =[]
for(i=0;i<144;i++){
    jsonUrl[i] = 'https://www.hooq.tv/search?page='+i+'&size=18&scope=min%2Cimages&as=MOVIE'

}

nightmare
    .goto(url)
    //.cookies.get()
    .wait('.btn')
    //.click('.btn')
    .wait('#email')
    .type('#email', 'hifa@aditus.info')
    //.click('#submit-button')
    .wait(20000)
    //.goto('https://www.hooq.tv/search?page=2&size=18&scope=min%2Cimages&as=MOVIE')
    .then(()=>{
        // console.log(cookies)
        // fs.writeFileSync('hooq_nmjs_cookie',JSON.stringify(cookies))
        
        var run = function * () {
            //var jsonUrl = ['http://www.yahoo.com', 'http://example.com', 'http://w3c.org'];
            var response = [];
            for (var i = 0; i < jsonUrl.length; i++) {
              var title = yield nightmare2.goto(jsonUrl[i])
                .wait('body')
                .then(()=>{
                    response.push(body);
                    fs.appendFileSync('hooq_movie_dump.json',JSON.stringify(body))
                });
                //response.push(body);
            }
            return response;
          }
          
          vo(run)(function(err, res) {
            console.dir(res);
          });
    })

    // vo = require('vo'),
    // nightmare2 = Nightmare();
  
  