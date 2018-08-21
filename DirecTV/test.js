const fs = require("fs")
var _ = require("lodash");

tmp = JSON.parse(fs.readFileSync('movie_id.json'));
movieURLS = [], titles = [], imgLinks = [], mID = [], synopsis = [], rel_date = []
length = tmp.length
start = 6000;
end = 7000;

url = "https://www.directv.com/movies/Natural-Born-Killers-M2UrN3FLVVBQcmdIeXRwUi9KNXFUQT09"

for (i = start; i < end; i++) {
    movieURLS[i] = tmp[i].movieLink
    titles[i] = tmp[i].movieTitle
    // imgLinks[i] = tmp[i].movieImg
    synopsis[i] = tmp[i].synopsis
    rel_date[i] = tmp[i].release_date
    mID[i] = tmp[i].movieID
}

idx = _.findIndex(tmp, function (k) {
    return k.movieLink === url
});

title = titles[idx]
moID = mID[idx]
synop = synopsis[idx]
rel_dat = rel_date[idx]
    // imgLink = imgLinks[idx]
    console.log(title,moID,synop,rel_dat)