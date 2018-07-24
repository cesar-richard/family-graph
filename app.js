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

global.cas = cas;

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

app.use(function(err, req, res, next) {
  res.status(err.status);
  res.render('error.html.twig', {
    message: err.message,
    error: err
  });
});
console.log('Error handler initialized'); // eslint-disable-line no-console

module.exports = app;
