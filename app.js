// module requirements
var express = require('express'),
    hbs = require('express-hbs'),

// local variables
    app = express();

// configure view engine
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express3({
    layout: 'layout.hbs'
}));
app.set('views', __dirname + '/views');

// configure static files
app.use(__dirname + '/static');


// CONFIGURE REQUESTS
app.get('/', function(req, res) {
    res.render('index.hbs');
});
    