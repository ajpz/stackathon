//linkscrape
var getHtml = require('./getHtml');
var linkscrape = require('linkscrape');
//var htmlToText = require('html-to-text');

var url = 'http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs'
getHtml(url)
.then(function(htmlObj) {
    //var origin = getLocation(url);
    console.log('got HTML');
    linkscrape(url, htmlObj.html, function(links, $){
        console.log(links.length);
        for (var i = 0; i < links.length; i++) {
            if (links[i].link != null) {
                console.log(links[i].link);
            }
        }
        console.log("\n\n$:");
                console.log($());
    });
});


   // // Get only the external links:
   //  var external = $('a[href]').filter(function(){
   //      return this.hostname != location.hostname;
   //  });

// var getLocation = function(href) {
//     var l = document.createElement("a");
//     l.href = href;
//     return l;
// };
// var l = getLocation("http://example.com/path");
// console.debug(l.hostname)
// >> "example.com"
// console.debug(l.pathname)
// >> "/path"




