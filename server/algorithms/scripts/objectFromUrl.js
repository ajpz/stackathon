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
var titleFromHtml = require('./titleParser');
var linksFromHtml = require('./linkParser');
var getHtml = require('./getHtml');


var grabAndParseUrl = function(url, maxNumKeyWords) {
    return getHtml(url).then(function(htmlObj){
        var text = textFromHtml(htmlObj.html);
        var title = titleFromHtml(htmlObj.html);
        console.log("title", title);
        var linksArr = linksFromHtml(htmlObj);
        var formattedContent = contentToArray(text, maxNumKeyWords);
        console.log("GOOD");
        contentToArray.log(formattedContent);
        return Promise.resolve({words: formattedContent, childurls: linksArr, title: title});
    }).catch(function(err){
        console.log('BAD');
        //catch error here and return empty obj to crawl function
        return Promise.resolve({words: [], childurls: []});
    })
}

module.exports = function(url, maxNumKeyWords){
    return grabAndParseUrl(url, maxNumKeyWords)
}

//use the following for testing:
//var url = 'http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs'
//grabAndParseUrl(url, 10);
