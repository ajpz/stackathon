// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}


function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function drawTree (root) {

    console.log('D3 SCRIPT IS RUNNING');

    // helper function that wraps all root-dependent functionality
    var drawWhenDataAvailable = function(root) {
        console.log('D3.JSON CB FUNCTION INVOKED WITH ROOT', typeof root, root);

        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

        node.append("circle")
            .attr("r", 4.5);

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text(function(d) { return d.url; });
    };

    //basic D3 tree configuration
    var diameter = 600;

    var tree = d3.layout.tree()
    .children(function(d) {
        return d.childNodes;  //update the children accessor function
    })
    .size([360, diameter / 2 - 120])
    .separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
    });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var svg = d3.select("body").append("svg")
        .attr("width", diameter)
        .attr("height", diameter - 150)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    drawWhenDataAvailable(root);

    d3.select(self.frameElement).style("height", diameter - 150 + "px");

}

function getTreeData (url, successCB, errorCB) {
    var urlWithoutSpecialChars = url.replace(/[^a-zA-Z0-9 ]/g, "");
    var cache;

    console.log('CHECK FOR CACHED RESULTS');

    chrome.storage.local.get('urlWithoutSpecialChars', function(cachedNeighbors) {
        cache = cachedNeighbors || {};

        if(Object.keys(cache).length > 0) {
            console.log('CACHE IS : ', cache );
            successCB(cache);
            return;
        }


        console.log('NO CACHE EXISTS, CACHE IS : ', cache);
        console.log('AJAX REQUEST TO API/GET-WEB: ', url);

        var x = new XMLHttpRequest();
        x.open('POST', 'http://localhost:1337/api/get-web');
        x.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        x.responseType = 'json';
        x.onload = function() {
            var response = x.response;
            console.log('THE RESPONSE IS : ', typeof response, response);

            if(!response) {
                errorCB('No response from api-get-web');
                return;
            }
            cache[urlWithoutSpecialChars] = response;
            chrome.storage.local.set(cache, function() {
                console.log('Cache Saved!');
            });
            successCB(response);
        };
        x.onerror = function() {
            errorCB('Network error.');
        };
        x.send(JSON.stringify({url: url}));

    });

};

function errorHandler(message) {
    console.error('Something went wrong: ', message);
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {
        console.log('Your home is currently: ', url);
        renderStatus('Gathering neighbors!')
        getTreeData(url, drawTree, errorHandler);

    });
});
