//titleParser.js

var getHtml = require('./getHtml');
var extractor = require('unfluff');

var extractTitleFromHtml = function(html) {
    var data = extractor(html);
    // console.log(data.text);
    // console.log('\n\n');
    //for(var prop in data) console.log(prop);
    return data.title;
};

module.exports = function(html) {
    return extractTitleFromHtml(html);
}
