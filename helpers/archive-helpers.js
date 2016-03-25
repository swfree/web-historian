var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');
var Promise = require('bluebird');
var redisClient = require('../web/redis-server.js');
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
  redisClient.smembers('sites', function(err, data) {
    callback(null, data);
  });
  // var path = exports.paths.list;
  // fs.readFile(path, 'utf8', function(err, file) {
  //   callback(null, file.split('\n'));
  // });
};
exports.readListOfUrlsAsync = Promise.promisify(exports.readListOfUrls);


exports.isUrlInList = function(url, callback) {
  console.log('URL is ' + url);
  redisClient.sismember('sites', url, function(err, bool) {
    if (err) { throw err; }
    console.log('isUrlInList bool: ' + bool);
    callback(null, bool);
  });
  // exports.readListOfUrlsAsync()
  //   .then(function(urls) {
  //     callback(null, _.contains(urls, url));
  //   });
};
exports.isUrlInListAsync = Promise.promisify(exports.isUrlInList);


exports.addUrlToList = function(urlToAdd, callback) {
  if(urlToAdd !== '') {
    if (urlToAdd !== undefined) {
      urlToAdd = urlToAdd.replace('http://', ''); // NTS: 
    }
    redisClient.sadd('sites', urlToAdd, function(err, bool) {
      if (err) { throw err; }
      console.log('added to redis server: ' + urlToAdd);
      callback(null);
    });
    // fs.appendFile(exports.paths.list, urlToAdd + '\n', 'utf8', function() {
    //   callback(null);
    // });
  }
};
exports.addUrlToListAsync = Promise.promisify(exports.addUrlToList);


exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', function(err, file) {
    err ? callback(null, false) : callback(null, true)
  });
};
exports.isUrlArchivedAsync = Promise.promisify(exports.isUrlArchived);


exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(pendingUrl) {
    if (pendingUrl === 'undefined') { return; }
    exports.isUrlArchivedAsync(pendingUrl)
      .then(function(exists) {
        if (!exists && pendingUrl !== '') {
          var editPendingUrl = 'http://' + pendingUrl;
          request(editPendingUrl, function(error, response, body) {
            if (error) { 
              throw error; 
            }
            fs.writeFile(exports.paths.archivedSites + '/' + pendingUrl, body, function(error) {
              if (error) { throw error; }
            });
          });
        } 
      });
  });
};
