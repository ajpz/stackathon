//htmlToText
var path = require('path');
var htmlToText = require('html-to-text');
var getHtml = require('./getHtml');

getHtml('http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs')
.then(function(htmlObj) {
    console.log('got HTML');
    ///console.log(html);
    // htmlToText.fromFile(path.join(__dirname, 'sample.html'),
    // function(err, text) {
    // if (err) return console.error(err);
    // console.log(text);
    // });

    var text = htmlToText.fromString(htmlObj.html);
    console.log(text.toString());
});

