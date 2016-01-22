/*
take raw html (string) + self-url
find all link tags
throw out same-site tags
return array of foreign link urls
*/

var getHtml = require('./getHtml');
var sampleHTML;

var getExternalLinksOnly = function(allLinks) {
  return hrefLinks;
};

var getLinks = function(html) {

  var links = [];

  //helper Funcs
  var findNextHref = function(html) {
    return html.search('href=')
  };

  var findEndQuotationMark = function(quoteChar, html) {
    return html.search(quoteChar);
  };

  var findPrecedingTag = function(startIndex, html) {

    var index = startIndex - 6;
    var counter = 0;
    while(html[index] !== '<') {
      index--;
      if(counter++ > 50) break;
    }
    if(html[index] === '<') {
      var rest = html.slice(index+1);
      return rest.slice(0, rest.search(' '));
    }
    return;
  }

  //recursive parser function
  var findOneLinkAndSlice = function(html) {

    var startIndex = findNextHref(html) + 5; // quotation mark at end of href="
    if(startIndex - 5 === -1) return links;

    var quoteChar = html[startIndex],
        endIndex = startIndex + findEndQuotationMark(quoteChar, html.slice(startIndex + 1)) + 1;
    console.log(startIndex);
    links.push([html.slice(startIndex + 1, endIndex), findPrecedingTag(startIndex, html)]);
    return findOneLinkAndSlice(html.slice(endIndex + 1));
  }

  return findOneLinkAndSlice(html);
}




getHtml('www.cnn.com')
.then(function(htmlFound) {
  console.log('html: ', htmlFound);
  return getLinks(htmlFound);
})
// .then(function(allLinks) {
//   return getExternalLinksOnly(allLinks);
// })
.then(function(links) {
  console.log('links: ', links)
})



