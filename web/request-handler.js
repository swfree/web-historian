var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('querystring');
var _ = require('underscore');

var router = require('./router');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var statusCode;
  if(req.method === 'GET') { statusCode = 200 };
  if(req.method === 'POST') { statusCode = 201 };


  if (fs.existsSync(__dirname + '/public/' + req.url) && statusCode === 200) {  
    router.getStaticFiles(req, res, statusCode);
  } else if (statusCode === 200) {
    fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
      handleError(res, err);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    });  
  } 
  
  router.postReq(req, res, statusCode);
};

var handleError = function(res, err) {
  if(err) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('' + err);
  }
}