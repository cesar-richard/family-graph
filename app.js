const config = require('./config');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const CASAuthentication = require('cas-authentication');
const orm = require('./app/orm');
const errors = require('./app/middlewares/errors');
const migrationsManager = require('./migrations');
const logger = require('./app/logger');

const cas = new CASAuthentication(config.common.cas);

const routes = require('./app/routes/index');

const init = () => {
  const app = express();
  const port = config.common.port || 8080;
  module.exports = app;

  app.locals.title = config.common.locals.appTitle;

  app.set('view engine', 'twig');
  app.set('views', path.join(__dirname, 'app/views'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    session({
      secret: 'seeWhatYouDidThere?!',
      resave: false,
      saveUninitialized: true
    })
  );
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);

  orm.init(app);

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

  Promise.resolve()
    .then(() => {
      if (!config.isTesting) {
        // return migrationsManager.check();
      }
    })
    .then(() => orm.init(app))
    .then(() => {
      app.use(errors.handle);
      logger.info(`Listening on port: ${port}`);
    })
    .catch(logger.error);
};
init();
