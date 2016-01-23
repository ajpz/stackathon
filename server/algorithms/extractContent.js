var getHtml = require('./getHtml');
var extractor = require('unfluff');

var url = 'http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs'
getHtml(url)
.then(function(htmlObj) {
    var data = extractor(htmlObj.html);
    console.log(data.text);
    console.log('\n\n');
    for(var prop in data) console.log(prop);
});
