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

function UrlNode(url, depth) {
    this.depth = depth;
    this.url = url;
    //this.html = function....
    this.childurls = [];//get from function
};

function SearchTree(node) {
    this.value = node;
}

