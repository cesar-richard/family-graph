var config = require('./class/config');
config.init();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var CASAuthentication = require('cas-authentication');
var cas = new CASAuthentication(config.cas);
global.cas = cas;


var routes = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( session({
  secret            : 'cEstLeMarketPutainMaggle!',
  resave            : false,
  saveUninitialized : true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/logout', function(req, res){
  console.log("User " + req.user.displayName + " logged out.");
  req.logout();
  res.redirect('/');
});

console.log("Routes initialized");

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html.twig', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.html.twig', {
    message: err.message,
    error: {}
  });
});
console.log("Error handler initialized");

module.exports = app;
