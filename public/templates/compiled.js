this["FistWallet"] = this["FistWallet"] || {};
this["FistWallet"]["templates"] = this["FistWallet"]["templates"] || {};

this["FistWallet"]["templates"]["homeindex"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n<input type=\"button\" value=\"Create Wallet\" class=\"create-wallet\" />\n<section class=\"bitcoin\"></section>\n<section class=\"litecoin\"></section>\n<section class=\"namecoin\"></section>\n\n";
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