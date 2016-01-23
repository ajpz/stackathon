var Promise = require('bluebird');
var _ = require('lodash');
var getObjectData = require('./scripts/objectFromUrl.js');
//var linkParser = require('./scripts/linkParser.js');
/*

helperFunc, createNode()
get origin url and html
getLinks from linkParser
get content from contentParser/Cleaner
build node

for node's links:

recursively calls http
http requests to get data

until n-deep is reached on each branch

returns tree ---> to front end
*/

var MAX_DEPTH = 3;


function UrlNode(url, depth) { //removed 3rd param: parentNode to try and limit circular error
    this.depth = depth;
    this.url = url;
    // this.parentNode = parentNode || null;
    this.keywords = {};
    this.childNodes = [];
};

UrlNode.prototype.prettyPrint = function()
{
    var depthStr = ''
    var i = 0;
    while(i <= this.depth) {
        depthStr +='--';
        i++;
    }
    console.log(depthStr + this.url + ',#Children:' + (this.childNodes ? this.childNodes.length : 0));
    if(this.childNodes) {
        for (i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].prettyPrint();   //use prettyPrint for debugging tree
        }
    }
}

// var crawlLinkRecursive = function(parentNode) {
//     return linkParser(parentNode.url)
//     .map(function(link) {
//         var newNode = new UrlNode(link, parentNode.depth + 1);
//         if(newNode.depth < MAX_DEPTH) {
//             return crawlLinkRecursive(newNode).then(function(childNodes) {
//                 newNode.childNodes = childNodes;
//                 return newNode;
//             }).catch(function(err) {
//                 newNode.childNodes = [];
//                 return newNode;
//             });
//         }
//         return newNode;
//     })
// }

//might want to rewrite this to be breadth first, and then render level by level
var crawlLinkRecursive = function(parentNode) {
    //async: gets html from url and extracts keywords and childlinks
    return getObjectData(parentNode.url, 10)
    .then(function(urlData){
        //now we have keywords and childurls for this node.
        parentNode.keywords = urlData.keywords;
        //then, for each link, do the same
        console.log(parentNode.keywords);
        console.log(urlData.childurls[0]);
        if(urlData.childurls) {
            urlData.childurls
            .map(function(link) {
                var newNode = new UrlNode(link, parentNode.depth + 1);
                if(newNode.depth < MAX_DEPTH) {
                    return crawlLinkRecursive(newNode).then(function(childNodes) {
                        newNode.childNodes = childNodes;
                        return newNode;
                    }).catch(function(err) {
                        newNode.childNodes = [];
                        return newNode;
                    });
                }
                return newNode;
            });
        }
    });
}

//for testing - uncomment this....
var testUrl = 'http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs';
var headNode = new UrlNode(testUrl, 0);
crawlLinkRecursive(headNode).then(function(arrayOfChildNodes) {
    headNode.childNodes = arrayOfChildNodes
    console.log('\n\n\n\n\n\nDONEDONEDONE');
    console.log(headNode);
    //headNode.prettyPrint();
})

module.exports = function(url) {
  var headNode = new UrlNode(url, 0);

  return crawlLinkRecursive(headNode)
  .then(function(arrayOfChildNodes) {
    headNode.childNodes = arrayOfChildNodes
    console.log('\n\n\n\n\n\nDONEDONEDONE');
    headNode.prettyPrint();
    return headNode;
})


}
