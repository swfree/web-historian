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
  // * * * * * /user/web-historian/web/htmlfetcher.js >> /user/web-historian/web/htmlfetcher.log 2>&1