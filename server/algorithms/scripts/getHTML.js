var http = require('http');
var Promise = require('bluebird');
var urlParser = require('url').parse;

var requestCounter = 0;
var errorCounter = 0;
var endCounter = 0;
var dataCounter = 0;
var timeoutCounter = 0;

var getHtml = function(href) {

  var parsedUrl = urlParser(href),
      host = parsedUrl.host,
      path = parsedUrl.path || '/';

  // if(!path) path = '/';

  var options = { host: host, path: path, method: 'GET', headers: {Accept: "text/html"}};

  return new Promise(function(resolve, reject) {


    var request = http.request(options, function(response){
      requestCounter++;
      console.log('++REQUEST ' + requestCounter + ' ' + '[' + host + ',' +path + ']');

      var html = '';
      response.setEncoding('utf8');

      response.on('data', function(chunk) {
        html += chunk;
      });

      response.on('end', function(){
        endCounter++;
        console.log('++++END EVENT: ' + endCounter + ' ' + '[' + host + ',' +path + ']');
        resolve({ host: host, html: html, reqC: requestCounter, errC: errorCounter, endC: endCounter, dataC: dataCounter });
      });
    });

    request.on('error', function(err) {
      errorCounter++;
      console.log('++++ERROR EVENT: ' + errorCounter + ' ' + '[' + host +path + ']');
      reject(err);
    });

    request.setTimeout(3000, function() {
      timeoutCounter++;
      console.log('++++TIMEOUT EVENT: ' + timeoutCounter + ' ' + '[' + host + ',' +path + ']');
      request.abort();
      reject(new Error('TIMEOUT EVENT FOR ' + host +path));
    })

    request.end();
  })
}

module.exports = getHtml;
