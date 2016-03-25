var archive = require('../helpers/archive-helpers.js');

exports.fetcher = function() {
  archive.readListOfUrls(function(nullError, urlArr) {
    console.log(urlArr);
    archive.downloadUrls(urlArr);
  });
}

exports.fetcher();
