var fs = require('fs');
var _ = require('lodash');
//fs.readFile('hungama_links_temp.json');

var obj, temp=[],urls=[];
fs.readFile('hungama_links_temp.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  for (i=0;i<obj.length;i++){
    //onsole.log(obj[i].linkUrl);
    if(_.includes(obj[i].linkUrl,'movie'))
        temp.push(obj[i].linkUrl)
    }
    urls = _.uniq(temp);
    console.log(urls)
});