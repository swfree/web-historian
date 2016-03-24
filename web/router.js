var fs = require('fs');
var url = require('url');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');
var request = require('request');

var defaultCorsHeaders = {
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
};

var getStaticFiles = function(req, res) {
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
      res.writeHead(200, defaultCorsHeaders);
      res.end(fileContents);
    } else {
      handleError(res, err);
    }
  });
};

var getSiteArchiveStaticFiles = function(req, res) {
  fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
    handleError(res, err);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });  
} 

var postReq = function(req, res) {
  var postContents = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    postContents += chunk;
  });
  req.on('end', function() {
    var postedURL = qs.parse(postContents).url;
    archive.isUrlArchived(postedURL, function(nullError, exists){
      if(exists) {
        res.writeHead(302, {
          'content-type': 'text/html',
          'location': 'http://127.0.0.1:8080' + '/' + postedURL
        });
        res.end('redirecting');
      } else {
        archive.isUrlInList(postedURL, function(nullError, is) {
          if (!is) {
            archive.addUrlToList(postedURL, function(nullError) {}); // worker will ensure urls in list are archived
          }
          res.writeHead(302, {
            'content-type': 'text/html',
            'location': 'http://127.0.0.1:8080' + '/' + 'loading.html'
          });
          res.end('redirecting');
        });
      }
    });
  });
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
exports.getArchiveStaticFiles = getSiteArchiveStaticFiles;
exports.postReq = postReq;