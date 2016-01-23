/* dataFromUrl.js
*   use this file in crawl.js to call the following
*       1.getHtml
*       2.extractContent
*       3.extract external links
*
*   it will return a UrlNode-like object with
*/
var contentToArray = require('contentCleaner');
var textFromHtml = require('extractContent');
var getHtml = require('./getHtml');

var url = 'http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs'

getHtml(url).then(function(htmlObj){
    var text = extractor(htmlObj.html).text;
    var formattedContent = contentToArray(text);
    console.log(formattedContent);
})
