/*
take raw html (string) + self-url
find all link tags
throw out same-site tags
return array of foreign link urls
*/

var getHtml = require('./getHtml');
var _ = require('lodash');

// filter links for a site to find external links only
var getExternalLinksOnly = function(allLinks, host) {

  var excludedLinks = [];
  var excludeSchemes = ['www'];

  var hostWords = host.split('.')
    .slice(0,-1)
    .filter(function(word) {
      return excludeSchemes.indexOf(word) === -1;
    }).concat(['html', 'pdf', 'asp', 'css', 'jpg', 'gif','javascript','tel:','skype:']);

  var urlIsHostRelated = function(url) {
    for(var i = 0; i < hostWords.length; i++) {
      if(url.search([hostWords[i]]) > -1) return true;
    }
    return false;
  }

  return allLinks.filter(function(link) {

    var startCharsToExclude = ['/', '#', '"', "'"];

    if( startCharsToExclude.indexOf(link[0][0]) > -1 ||
        link[1] === 'link' ||
        urlIsHostRelated(link[0]) ) {

      excludedLinks.push(link[0]);
      return false;
    }
    return true;
  })
};

// get all links for a starting href
var getLinks = function(html) {

  var links = [];

  //helper Funcs
  var findNextHref = function(html) {

    var index = 0,
        length = html.length;

    while(html.slice(index, index + 5) !== 'href=') {
      index++;
      if(index >= length) break;
    }
    if (index >= length) return -1;
    return index;
  };

  var findEndQuotationMark = function(quoteChar, html) {
    var index = 0,
        length = html.length;

    while(html[index] !== quoteChar) {
      index++;
      if(index >= length) break;
    }
    if (index >= length) return -1;
    return index;

  };

  var findPrecedingTag = function(startIndex, html) {

    var index = startIndex - 6;
    var counter = 0;
    while(html[index] !== '<') {
      index--;
      if(counter++ > 200) break;
    }
    if(html[index] === '<') {
      var rest = html.slice(index+1);
      return rest.slice(0, rest.search(' '));
    }
    return;
  }

  //recursive parser function
  var findOneLinkAndSlice = function(html) {

    try {
      var startIndex = findNextHref(html) + 5; // quotation mark at end of href="
      if(startIndex - 5 === -1) return links;

      var quoteChar = html[startIndex],
          endIndex = startIndex + 1 + findEndQuotationMark(quoteChar, html.slice(startIndex + 1));
    } catch(err) {
      console.log('CAUGHT : ', err);
    }

    links.push([html.slice(startIndex + 1, endIndex), findPrecedingTag(startIndex, html)]);
    return findOneLinkAndSlice(html.slice(endIndex + 1));
  }

  return findOneLinkAndSlice(html);
}


// module.exports = function(originHref) {
//   var scrapedData;
//   return getHtml(originHref)
//   .then(function(scraped) {
//     scrapedData = scraped;
//     return getLinks(scraped.html);
//   })
//   .then(function(allLinks) {
//     return getExternalLinksOnly(allLinks, scrapedData.host);
//   })
//   .then(function(externalLinks) {
//     return externalLinks.map(function(linkArr) {
//       return linkArr[0];
//     })
//   })
//   .then(function(links) {
//     var unique = _.uniq(links);
//     return unique;
//   })
//   .then(null, function(err) {
//     console.error('\n\nLINK PARSER FAILED\n\n')
//   })
// };

module.exports = function(htmlObj) {
  var allLinks = getLinks(htmlObj.html);
  var externalLinks = getExternalLinksOnly(allLinks, htmlObj.host);

  var links = externalLinks.map(function(linkArr) {
      return linkArr[0];
    });
  return _.uniq(links);
  // })
  // .then(null, function(err) {
  //   console.error('\n\nLINK PARSER FAILED\n\n')
  // })
};
