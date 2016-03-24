var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('querystring');
var _ = require('underscore');

var router = require('./router');
var url = require('url');
// require more modules/folders here!

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