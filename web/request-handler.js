var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('querystring');
var _ = require('underscore');

var router = require('./router');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var statusCode = (req.method === 'GET') ? 200 : 201;

  /* Gets archived sites: */
  var knownUrls = ['/', '/index.html', '/loading.html', '/styles.css'];
  if (!_.contains(knownUrls, req.url) && statusCode === 200) {  
    fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
      handleError(res, err);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    });
  /* Gets static sites: */
  } else if (statusCode === 200) {
    router.getStaticFiles(req, res, statusCode);
  } 

  //   var statusCode = (req.method === 'GET') ? 200 : 201;
  // if (req.url.indexOf('archive') !== -1 && statusCode === 200) {  
  //   fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
  //     handleError(res, err);
  //     res.writeHead(200, {'Content-Type': 'text/plain'});
  //     res.end(data);
  //   });
  // } else if (statusCode === 200) {
  //   router.getStaticFiles(req, res, statusCode);
  // }

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
};

var handleError = function(res, err) {
  if(err) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('' + err);
  }
}