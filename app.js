const config = require('./class/config');

config.init();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const CASAuthentication = require('cas-authentication');

const cas = new CASAuthentication(config.cas);
var fakeCas = {
  session_name: "session", 
  block:function (req, res, next){
    req.session[this.session_name]="testuser";
    next();
  },
  bounce:function (req, res, next){
    req.session[this.session_name]="testuser";
    next();
  }
}
global.cas = process.env.NODE_ENV==="testing"?fakeCas:cas;

const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'cEstLeMarketPutainMaggle!',
    resave: false,
    saveUninitialized: true
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

console.log('Routes initialized'); // eslint-disable-line no-console

app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
console.log('Error handler initialized'); // eslint-disable-line no-console

module.exports = app;
