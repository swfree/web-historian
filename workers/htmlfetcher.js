// requires
var archive = require('../helpers/archive-helpers.js');



// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
//8. archive.readListOfUrls(function(urls){ archive.downloadUrls(urls)}) <<< this will be run by our worker
// without CRON:
  // setInterval
    // archive.readListOfUrls(function(urls) { archive.downloadUrls(urls) })

// with CRON: remove setInterval from htmlfetcher
  // from Terminal, run ' crontab -e '
  // this will open new crontab in vi. enter: 
  //    time      command to run                log output to file       StdErr+StdOut
  // * * * * * node /Users/student/Codes/2016-02-web-historian/workers/htmlfetcher.js >> /Users/student/Codes/2016-02-web-historian/workers/htmlfetcher.log 2>&1

exports.fetcher = function() {
  archive.readListOfUrls(function(urlArr) {
    archive.downloadUrls(urlArr);
  });
}

exports.fetcher();