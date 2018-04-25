const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: false });
const fs = require("fs");

nightmare
  .goto("https://erosnow.com/movies/mostpopular")
  //.type("#search_form_input_homepage", "github nightmare")
  //.click("#search_button_homepage")
  .wait(".qtip-tooltip")
  .evaluate(
    () => {
      var jsonData = [], elements= {};
      var data = document.querySelectorAll(".qtip-tooltip");

      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        // elements.title = data[i].querySelector(".bold").innerHTML;
        // elements.link = data[i].href;
        // elements.thumbnail = data[i].querySelector(".adaptiveSize90").src;
        jsonData.push({"title":data[i].querySelector(".bold").innerHTML, "link" :data[i].href , "thumbnail" : data[i].querySelector(".adaptiveSize90").src  });
      }

      //console.log(data.toString());
      //return [document.querySelectorAll(".qtip-tooltip").mtitle];
      return jsonData;
    })
  .end()
  .then(function (data) {
    console.log(data);
    fs.writeFileSync("movie_data.json", JSON.stringify(data));
  }

  )
  .catch(error => {
    console.error("Search failed:", error);
  });
