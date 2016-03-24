var fs = require('fs');
var url = require('url');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
};


var getStaticFiles = function(req, res, statusCode) {
  var uri = url.parse(req.url).pathname;
  var filePath = (uri === '' || uri === '/')
    ? filePath = path.join(__dirname, 'public', 'index.html')
    : path.join(__dirname, 'public', uri);

  fs.stat(filePath, function(err, stat) {
    if (err === null) {
      var fileContents = fs.readFileSync(filePath);
      if (path.extname(filePath) === '.html') {
        defaultCorsHeaders['Content-Type'] = 'text/html';
        fileContents = fileContents.toString();
      }
      if (path.extname(filePath) === '.js') {
        defaultCorsHeaders['Content-Type'] = 'application/javascript';
        fileContents = fileContents.toString();
      }
      if (path.extname(filePath) === '.css') {
        defaultCorsHeaders['Content-Type'] = 'text/css';
        fileContents = fileContents.toString();
      }
      if (path.extname(filePath) === '.gif') {
        defaultCorsHeaders['Content-Type'] = 'image/gif';
      }
      res.writeHead(statusCode, defaultCorsHeaders);
      res.end(fileContents);
    } else {
      res.writeHead(200, defaultCorsHeaders);
      res.end();
    }
  });
};

var postReq = function(req, res, statusCode) {
  if (req.method === 'POST' && req.url === '/') {
    var postContents = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      postContents += chunk;
    });
    req.on('end', function() {
      var postedURL = qs.parse(postContents).url + '\n'
      fs.appendFile(archive.paths.list, postedURL, function(err) {
        handleError(res, err);
        res.writeHead(302, {'Content-Type': 'text/plain'});
        res.end();
      });
    });
  }
}

var handleError = function(res, err) {
  if(err) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('' + err);
  }
}

// exports.getMessages = getMessages;
// exports.postMessages = postMessages;
exports.getStaticFiles = getStaticFiles;
exports.postReq = postReq;