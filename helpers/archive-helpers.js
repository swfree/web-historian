var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var path = exports.paths.list;
  fs.readFile(path, 'utf8', function(err, file) {
    callback(file.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(_.contains(urls, url))
  });
};

exports.addUrlToList = function(urlToAdd, callback) {
  fs.writeFile(exports.paths.list, urlToAdd, 'utf8', function() {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', function(err, file) {
    err ? callback(false) : callback(true)
  });
};

exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(pendingUrl) {
    exports.isUrlArchived(pendingUrl, function(exists) {
      if (!exists) {
        fs.writeFile(exports.paths.archivedSites + '/' + pendingUrl, pendingUrl, function(err) {
          if (err) { throw err; }
        });
      } 
    });
  });
};
