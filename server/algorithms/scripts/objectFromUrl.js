/* objectFromUrl.js
*   use this file in crawl.js to call the following
*       1.getHtml
*       2.extractContent
*       3.extract external links
*
*   it will return a UrlNode-like object with
*/
var contentToArray = require('./contentCleaner');
var textFromHtml = require('./contentParser');
var linksFromHtml = require('./linkParser');
var getHtml = require('./getHtml');


var grabAndParseUrl = function(url, maxNumKeyWords) {
    return getHtml(url).then(function(htmlObj){
        var text = textFromHtml(htmlObj.html);
        var linksArr = linksFromHtml(htmlObj);
        var formattedContent = contentToArray(text, maxNumKeyWords);
        // console.log(formattedContent);
        // console.log(linksArr);
        return({keywords: formattedContent, childurls: linksArr});
    }).catch(function(err){
    //catch error here and return it to crawl function
        return {keywords: {}, childurls: []};
    })
}

module.exports = function(url, maxNumKeyWords){
    return grabAndParseUrl(url, maxNumKeyWords)
}

//use the following for testing:
//var url = 'http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs'
//grabAndParseUrl(url, 10);
