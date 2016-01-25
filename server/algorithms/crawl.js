var Promise = require('bluebird');
var _ = require('lodash');
var getObjectData = require('./scripts/objectFromUrl.js');
var fs = require('fs');
var urlParser = require('url').parse;
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
    this.words = [];
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
    console.log(depthStr + this.url + ',#Children:' + (this.childNodes ? this.childNodes.length : 0) + '--');
    if(this.childNodes) {
        for (i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].prettyPrint();   //use prettyPrint for debugging tree
        }
    }
}

UrlNode.prototype.removeLeafChildren = function() {

    var removeLeafChildren = function (node) {
        //create shortUrl property
        node.shortUrl = urlParser(node.url).host;
        var children = node.childNodes;
        //recursively go through all nodes
        //if node has empty childNode array, delete the childNode property altogether
        if(!children) return;
        if(children.length === 0) {
            delete node.childNodes;
            return;
        }

        for (var i = 0; i < children.length; i++) {
            removeLeafChildren(children[i]);
        }
        return;
    }

    removeLeafChildren(this);
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
    //async: gets html from url and extracts words and childlinks
    return getObjectData(parentNode.url, 12)
    .then(function(urlData){
        console.log('CRAWL GOT DATA');
        var wordsArr = Object.keys(urlData.words).map(function(k){
            return {
                'text': k, 'size': urlData.words[k]
            }
        });
        console.log(wordsArr);
        //now we have words and childurls for this node.
        parentNode.words = wordsArr;
        parentNode.title = urlData.title;
        //then, for each link, do the same
        if(parentNode.depth < MAX_DEPTH) {
            if(urlData.childurls) {
                return Promise.resolve(urlData.childurls)
                .then(function(links) {
                    console.log(links);
                    return links;
                })
                .map(function(link) {
                    var newNode = new UrlNode(link, parentNode.depth + 1);
                    if(newNode.depth <= MAX_DEPTH) {
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
        }
    }).catch(function(err) {
        console.log("\n\n\n\n\n\nERROR IN LINE 94\n\n\n\n");
        console.log(err);
    });
}

//for testing - uncomment this....
// var testUrl = 'http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs';
// var headNode = new UrlNode(testUrl, 0);
// crawlLinkRecursive(headNode)
// .then(function(arrayOfChildNodes) {
//     headNode.childNodes = arrayOfChildNodes
//     console.log('\n\n\n\n\n\nDONEDONEDONE');
//     //console.log(headNode);
//     headNode.prettyPrint();
//     return headNode;
// })
// .then(function(headNode) {
//     headNode.removeLeafChildren();
//     fs.writeFileSync('./formatted_data.json', JSON.stringify(headNode));
// })

module.exports = function(url) {
    var headNode = new UrlNode(url, 0);

    return crawlLinkRecursive(headNode)
    .then(function(arrayOfChildNodes) {
        headNode.childNodes = arrayOfChildNodes
        console.log('\n\n\n\n\n\nDONEDONEDONE');
        headNode.prettyPrint();
        return headNode;
    })
    .then(function(headNode) {
        headNode.removeLeafChildren();
        console.log("DIRECTORY: ", __dirname, headNode)
        //fs.writeFileSync('./public/data/route-generated.json', JSON.stringify(headNode));
        return headNode;
    })
}
