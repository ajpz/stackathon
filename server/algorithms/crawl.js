var Promise = require('bluebird');
var _ = require('lodash');
var linkParser = require('./linkParser.js');
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

var maxDepth = 2;

function UrlNode(url, depth, parentNode) {
    this.depth = depth;
    this.url = url;
    this.parentNode = parentNode || null;
    //this.html = function....
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
    //console.log(depthStr + "{url: " + this.url + "\ndepth:" + this.depth + "}");
    console.log(depthStr + this.url + ',#Children:' + this.childNodes.length);

    for (i = 0; i < this.childNodes.length; i++) {
        this.childNodes[i].prettyPrint();   //use prettyPrint for debugging tree
    }
}

var headNode = new UrlNode('http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs', 0);

//depth-first:
//this function should return a promise!
// var crawlLinkRecursive = function(parentNode) {
//     //var thisNode = new UrlNode(parentNode.url, parentNode.depth +);
//     console.log('parentNode',parentNode.url);
//     return linkParser(parentNode.url)
//     .then(function(links) {
//         //.map is a Promise method here:
//         parentNode.childNodes = links.map(function(link) {
//             //recursively create nodes:
//             var thisNode = new UrlNode(link, parentNode.depth +1);
//             thisNode.parentNode = parentNode;
//             //find all children:
//             if (thisNode.depth < maxDepth) thiscrawlLinkRecursive(thisNode);
//             console.log('done');
//             return thisNode;
//         });
//     });
// }

var crawlLinkRecursive = function(parentNode) {
    return linkParser(parentNode.url)
    .map(function(link) {
        //console.log('child: ', link);
        var newNode = new UrlNode(link, parentNode.depth + 1, parentNode);
        if(newNode.depth < maxDepth) {
            return crawlLinkRecursive(newNode).then(function(childNodes) {
                newNode.childNodes = childNodes;
                return newNode;
            }).catch(function(err) {
                newNode.childNodes = [];
                return newNode;
            });
        }
        return newNode;
    })
}

// linkParser(headNode.url).then(function(links){
//     console.log("LINKS");
//     console.log(links);
// });
crawlLinkRecursive(headNode).then(function(arrayOfChildNodes) {
    headNode.childNodes = arrayOfChildNodes
    //console.log(arrayOfChildNodes);
    console.log('\n\n\n\n\n\nDONEDONEDONE');
    headNode.prettyPrint();
})
