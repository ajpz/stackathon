var http = require('http');
var Promise = require('bluebird');
var urlParser = require('url').parse;

var getHtml = function(href) {
  console.log('beginning getHtml', href);
  var parsedUrl = urlParser(href),
      host = parsedUrl.host,
      path = parsedUrl.path || '/';

  if(!path) path = '/';
  console.log(path);
  var options = { host: host, path: path, method: 'GET', headers: {Accept: "text/html"}};

  return new Promise(function(resolve, reject) {
    console.log('requesting html');
    var request = http.request(options, function(response){
      var html = '';
      response.setEncoding('utf8');

      response.on('data', function(chunk) {
        //console.log('getting data');
        html += chunk;
      });

      response.on('end', function(){
        //console.log('end', html);
        resolve({ host: host, html: html });
      });
    });

    request.on('error', function(err) {
      console.error('\n\n\nERROR!!!\n\n\nproblem occured: ', err.message);
      reject(err);
    });

    request.end();
  })
}

module.exports = getHtml;
