this["FistWallet"] = this["FistWallet"] || {};
this["FistWallet"]["templates"] = this["FistWallet"]["templates"] || {};

this["FistWallet"]["templates"]["homeindex"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n<input type=\"button\" value=\"Create Wallet\" />\n<section class=\"bitcoin\"></section>\n<section class=\"litecoin\"></section>\n<section class=\"namecoin\"></section>\n\n";
  });

this["FistWallet"]["templates"]["main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n<header class=\"header\">\n  <div class=\"inner\">\n    <a href=\"/\" class=\"logo\">FistWallet</a>\n\n    <div class=\"intro\">\n      <p>FistWallet is a secure hosted wallet service for several types of blockchain currencies.</p>\n    </div>\n\n  </div>\n</header>\n\n<div class=\"body\">\n\n  <div class=\"inner\">\n    <div class=\"current-view\"></div>\n  </div>\n\n</div>\n\n<footer class=\"footer\">\n  <div class=\"inner\">\n    <p>Written by: Brian Mancini |\n    Project available on <a href=\"https://github.com/bmancini55/wallettest\">Github</a></p>\n  </div>\n</footer>\n";
  });