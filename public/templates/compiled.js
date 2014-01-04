this["FistWallet"] = this["FistWallet"] || {};
this["FistWallet"]["templates"] = this["FistWallet"]["templates"] || {};

this["FistWallet"]["templates"]["homeindex"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n\n<div class=\"forms\">\n  <form class=\"open-wallet\">\n    <h3>Sign In</h3>\n    <p><input type=\"text\" name=\"email\" /></p>\n    <p><input type=\"password\" name=\"pin\" /></p>\n    <p><input type=\"password\" name=\"password\" /></p>\n    <p><input type=\"submit\" value=\"Sign In\" /></p>\n  </form>\n\n\n  <form class=\"create-wallet\">\n    <h3>Sign Up</h3>\n    <p><input type=\"text\" name=\"email\" /></p>\n    <p><input type=\"password\" name=\"pin\" /></p>\n    <p><input type=\"password\" name=\"password\" /></p>\n    <p><input type=\"submit\" value=\"Create\" /></p>\n  </form>\n</div>\n\n\n<div class=\"supports\">\n  <h2 class=\"bitcoin\">BTC</h2>\n  <h2 class=\"litecoin\">LTC</h2>\n  <h2 class=\"namecoin\">NMC</h2>\n</div>\n\n\n<div class=\"info\">\n\n  <div class=\"reason\">\n    <h3>Semi-Hosted</h3>\n    <p>FistWallet data is available to you from all over the world but we don't have access to your private keys. Your browser decrypts your wallet for you to use locally.</p>\n  </div>\n\n  <div class=\"reason\">\n    <h3>Secure</h3>\n    <p>FistWallet uses strong two-layer encryption to both encrypt your wallet metadata and your wallet private keys. This ensures that we don't have access to your addresses, balances or even your metadata.</p>\n  </div>\n\n  <div class=\"reason\">\n    <h3>Online or Offline</h3>\n    <p>Use your wallet in online or offline mode. You can backup your wallet at any time. The encrypted back-up includes the unpacking utility that allows you to access your wallet data offline.</p>\n  </div>\n\n  <div class=\"reason\">\n    <h3>Currency Transfer</h3>\n    <p>Our built-in service allows you to transfer seemlessly between your various currencies.</p>\n  </div>\n\n</div>\n";
  });

this["FistWallet"]["templates"]["main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n<header class=\"header\">\n  <div class=\"inner\">\n    <a href=\"/\" class=\"logo\">FistWallet</a>\n\n    <div class=\"intro\">\n      <p>FistWallet is a secure hosted wallet service for several types of blockchain currencies.</p>\n    </div>\n\n  </div>\n</header>\n\n<div class=\"body\">\n\n  <div class=\"inner\">\n    <div class=\"current-view\"></div>\n  </div>\n\n</div>\n\n<footer class=\"footer\">\n  <div class=\"inner\">\n    <p>Written by: Brian Mancini |\n    Project available on <a href=\"https://github.com/bmancini55/wallettest\">Github</a></p>\n  </div>\n</footer>\n";
  });

this["FistWallet"]["templates"]["walletdetails"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n\n<p>\n  "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.format)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " \n  ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.callfunc || (depth0 && depth0.callfunc)),stack1 ? stack1.call(depth0, "encodePubKeyHash", options) : helperMissing.call(depth0, "callfunc", "encodePubKeyHash", options)))
    + "\n  ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.callfunc || (depth0 && depth0.callfunc)),stack1 ? stack1.call(depth0, "encodePrivKey", options) : helperMissing.call(depth0, "callfunc", "encodePrivKey", options)))
    + "\n</p>\n\n";
  return buffer;
  }

  buffer += "\n<h2>Your Fist Wallet</h2>\n\n<div class=\"currency-list\"></div>\n\n<div>\n";
  stack2 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.wallet)),stack1 == null || stack1 === false ? stack1 : stack1.addresses), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n";
  return buffer;
  });