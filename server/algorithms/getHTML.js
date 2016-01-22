var http = require('http');
var Promise = require('bluebird');
var urlParser = require('url').parse;

var getHtml = function(href) {

  var parsedUrl = urlParser(href),
      host = parsedUrl.host,
      path = parsedUrl.path || '/';

  if(!path) path = '/';

  var options = { host: host, path: path, method: 'GET', headers: {Accept: "text/html"}};

  return new Promise(function(resolve, reject) {

    var request = http.request(options, function(response){
      var html = '';
      response.setEncoding('utf8');

      response.on('data', function(chunk) {
        html += chunk;
      });

      response.on('end', function(){
        resolve({ host: host, html: html });
      });
    });

    request.on('error', function(err) {
      console.error('problem occured: ', err.message);
      reject(err);
    });

    request.end();
  })
}

module.exports = getHtml;
