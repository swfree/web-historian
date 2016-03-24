var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('querystring');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET' && req.url === '/') {
    var indexPath = archive.paths.siteAssets + '/index.html';
    fs.readFile(indexPath, 'utf8', function(err, data){
      handleError(res, err);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  }
  
  else if (req.url === '/styles.css') {
    var stylePath = archive.paths.siteAssets + '/styles.css';
    fs.readFile(stylePath, 'utf8', function(err, data){
      handleError(res, err);
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end(data);
    });
  }

  else {
    fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
      handleError(res, err);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    })
  }

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
        res.writeHead(302);
        res.end();
      });
    });
  }
};

var handleError = function(res, err) {
  if(err) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('' + err);
  }
}

// GET '/www.google.com'