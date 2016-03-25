var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
  console.log('connecting to redis server...');
});

module.exports = client;
