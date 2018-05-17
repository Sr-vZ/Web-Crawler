const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: false });
const fs = require("fs");

nightmare
  .goto("http://www.hungama.com/all/popular-54/4708/")
  //.type("#search_form_input_homepage", "github nightmare")
  //.click("#search_button_homepage")
  .wait(".movie-block-artist")
  .evaluate(
    () => {
      var jsonData = [], elements= {},links=[];
      var data = document.querySelectorAll(".movie-block-artist");

      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        // elements.title = data[i].querySelector(".bold").innerHTML;
        // elements.link = data[i].href;
        // elements.thumbnail = data[i].querySelector(".adaptiveSize90").src;
        jsonData.push({"title":data[i].querySelector("a").title, "link" :data[i].querySelector("a").href});
        links.push(data[i].querySelector("a").href);
      }

      //console.log(data.toString());
      //return [document.querySelectorAll(".qtip-tooltip").mtitle];
      return jsonData;
    })
  .end()
  .then(function (data) {
    console.log(data);
    fs.writeFileSync("hungama_data.json", JSON.stringify(data));
  }

  )
  .catch(error => {
    console.error("Search failed:", error);
  });
