/*
takes raw html file (string)
removes all tags
returns array of content words
*/

var getHtml = require('./getHtml');
var _ = require('lodash');

var contents = [];

//helper Funcs
var findNextMarker = function(html, marker) {
  var index = 0,
      length = html.length;

  while(html[index] !== marker) {
    index++;
    if(index >= length) break;
  }
  if (index >= length) return -1;
  return index;
};

//recursive parser function
var findOneMarkerAndSlice = function(html) {
  var exclude = ['', ' ', '\\', 'n', 't', 'r' ];

  var contentIsReal = function(content) {
    for(var i = 0; i < exclude.length; i++) {
      if(content === '') return false;
      if(content === ' ') return false;
      if(content.split('').every(function(char) {
        return exclude.indexOf(char) > -1;
      })) {
        return false;
      }
      // if(content.search(exclude[i]) > -1) return false;
    }
    return true;
  };

  try {
    var startIndex = findNextMarker(html, '>') + 1; // quotation mark at end of href="
    if(startIndex - 1 === -1) return contents;
    var endIndex = startIndex + findNextMarker(html.slice(startIndex), '<');
  } catch(err) {
    console.log('CAUGHT : ', err);
  }
  var content = html.slice(startIndex, endIndex);

  if(contentIsReal(content)) contents.push(content);
  return findOneMarkerAndSlice(html.slice(endIndex + 1));
}


module.exports = function(html) {
  console.log('INVOKED....')
  return findOneMarkerAndSlice(html);
};
