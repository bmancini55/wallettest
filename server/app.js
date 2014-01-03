// module requirements
var express = require('express')
  , CONFIG = require('../config.js').development

// local variables
  , app = express();

// configure static file directory
app.use('/public', express.static(__dirname + '../public'));


// CONFIGURE REQUESTS
app.get('/', function(req, res) {
  res.sendfile(__dirname + '..//public/index.html');
});



// BITCOIN SHIZZY
getBitcoinClient = function(cb) {
  var bitcoin = require('bitcoin')
    , bitcoinConfig = CONFIG.clients.bitcoind
    , client;    

  client = new bitcoin.Client({
    host: bitcoinConfig.host,
    port: bitcoinConfig.port,
    user: bitcoinConfig.user,
    pass: bitcoinConfig.pass
  });

  process.nextTick(function() {
      cb(null,client)
  });
}

app.get('/bitcoin/info', function(req, res) {
  getBitcoinClient(function(err, client) {
    client.getInfo(function(err, result) {
      if(err) res.send(err);
      else res.send(result);
    });
  });
});

app.get('/bitcoin/accounts', function(req, res) {
  getBitcoinClient(function(err, client) {
    client.listAccounts(function(err, result) {
      if(err) res.send(err);
      else res.send(result);    
    });
  });

});

app.get('/bitcoin/transactions', function(req, res) {
  getBitcoinClient(function(err, client) {
    client.listTransactions(function(err, result) {
      if(err) res.send(err);
      else res.send(result);    
    });
  });
});




// LITECOIN SHIZZY
getLitecoinClient = function(cb) {
  var litecoin = require('node-litecoin')
    , litecoinConfig = CONFIG.clients.litecoind
    , client;

  client = new litecoin.Client({
    host: litecoinConfig.host,
    port: litecoinConfig.port,
    user: litecoinConfig.user,
    pass: litecoinConfig.pass
  });

  process.nextTick(function() {
    cb(null, client);
  });
}

app.get('/litecoin/info', function(req, res) {
  getLitecoinClient(function(err, client) {
    client.getInfo(function(err, info) {
      if(err) res.send(err);
      else res.send(info);
    });
  });
});



console.log('listening on ' + CONFIG.server.port);
app.listen(CONFIG.server.port);
