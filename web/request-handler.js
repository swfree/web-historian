var fs = require('fs');
var router = require('./router');
var url = require('url');

exports.handleRequest = function (req, res) {

  if (req.method === 'GET') {
    fs.existsSync(__dirname + '/public/' + req.url)
    ? router.getStaticFiles(req, res)
    : router.getArchiveStaticFiles(req, res);
  }

  if (req.method === 'POST') {
    router.postReq(req, res);
  }
};