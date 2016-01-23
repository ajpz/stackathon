'use strict';
var crawl = require('../../../algorithms/crawl');
var router = require('express').Router();
module.exports = router;

router.post('/', function(req, res, next) {
  var originUrl = req.body.url;
  var originHtml = req.body.html;

  crawl(req.body.url)
  .then(function(originNode) {
    res.json(originNode);
  })
  .then(null, next);

});


/*

urlNode:
- origin: boolean
- depth: number
- url
- raw html
- stemmed words:
(@input: raw html, @output: data structure)
  - { <word>: frequency }
  - { <word>: image }
  -> algo for stemming and cleaning the words
  -> algo for getting seed images
- child links [ urls]
- parent link

-> Algo to produce a n-deep web around the start-url provided by the chrome extension
  - get HTML:
    - raw http/https requests
  - parse HTML:
    - find external links
    - find "content"
    - stem "content" --- natural node module




Later........
Front-end chrome extension:
- D3 node-web visualization: color coordinate by distance/layers from origin node
- Each node is a pop-up that shows word/image cloud of node
- user can traverse to next node and recenter visualization
*/
