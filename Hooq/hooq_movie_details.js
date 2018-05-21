var fs = require("fs");
var _ = require("lodash");

const Nightmare = require("nightmare");
const nightmare = Nightmare({
    show: true,
    //cookiesFiles: "./cookie.txt"
});

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


url = "https://www.hooq.tv/verify/email?h=eyJvdHAiOiI1NTE0NjgiLCJoYXNoIjoiM2I2ZUlja2hzTkZsQnpPVFUwWGVSWHArWldVPSIsInNpZ25hdHVyZSI6IjE0MzVjM2QwMGY4ODM1ODEwYjhjMjc2NjE1ZWYyMmFjZDhjOTI0NmI3N2QxOTM3MWYxZmFmMDIyMDkwNTJhZGMiLCJlbWFpbCI6ImhvZ2F5b21lcGlAYjJieC5uZXQiLCJjb3VudHJ5IjoiSU4iLCJhY3Rpb24iOiJzaWdudXAifQ=="
url =
  "https://www.hooq.tv/catalog/073aeadb-6a8a-4743-8ac5-64903a84e94f?__sr=feed&amp"
nightmare
    .goto(url)
    //.cookies.get()
    .then(cookies=>{
        console.log(cookies)
        fs.writeFileSync('hooq_nmjs_cookie',JSON.stringify(cookies))
    })