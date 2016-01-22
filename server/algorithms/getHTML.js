var http = require('http');
var Promise = require('bluebird');

var getHtml = function(url, path) {
  if(!path) path = '/';

  var options = { host: url, path: path, method: 'GET', headers: {Accept: "text/html"}};

  return new Promise(function(resolve, reject) {

    var request = http.request(options, function(response){
      var html = '';
      response.setEncoding('utf8');

      response.on('data', function(chunk) {
        html += chunk;
      });

      response.on('end', function(){
        resolve(html);
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
