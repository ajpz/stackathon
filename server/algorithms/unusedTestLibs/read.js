var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

var readDirRecursive = function (dirName) {
    return fs.readdirAsync(dirName)
        .map(function (fileOrDirInDirectory) {
            var fullPath = path.join(dirName, fileOrDirInDirectory);
            return fs.statAsync(fullPath)
            .then(function(stat){
                if (stat.isDirectory()) {
                        return readDirRecursive(fullPath);
                    } else {
                        return fullPath;
                    }
                });
        });
};
console.log(path.join(__dirname, '..'));
readDirRecursive(path.join(__dirname, '..'))
.then(console.log)
.catch(console.error);
