var getHtml = require('./getHtml');
var extractor = require('unfluff');

var extractTextFromHtml = function(html) {
    var data = extractor(html);
    // console.log(data.text);
    // console.log('\n\n');
    //for(var prop in data) console.log(prop);
    return data.text;
};

module.exports = function(html) {
    return extractTextFromHtml(html);
}
