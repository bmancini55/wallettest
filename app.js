// module requirements
var express = require('express')
  , CONFIG = require('./config.js').development
  , hbs = require('express-hbs')

// local variables
  , app = express();

// configure view engine
app.set('view engine', 'hbs');

// configure hbs
app.engine('hbs', hbs.express3({
  defaultLayout: __dirname + '/views/layout.hbs'
}));

// configure view directory
app.set('views', __dirname + '/views');

// configure static file directory
app.use('/public', express.static(__dirname + '/public'));


// CONFIGURE REQUESTS
app.get('/', function(req, res) {
  res.render('index.hbs');
});



// BITCOIN SHIZZY
getBitcoinClient = function(cb) {
  var bitcoin = require('bitcoin')
    , clientConfig = CONFIG.clients.bitcoind
    , client;    

  client = new bitcoin.Client({
    host: clientConfig.host,
    port: clientConfig.port,
    user: clientConfig.user,
    pass: clientConfig.pass
  });

  process.nextTick(function() {
      cb(null,client)
  });
}

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

console.log('listening on ' + CONFIG.server.port);
app.listen(CONFIG.server.port);
