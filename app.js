const config = require('./config');
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const CASAuthentication = require('cas-authentication');
const orm = require('./app/orm');
const errors = require('./app/middlewares/errors');
const migrationsManager = require('./migrations');
const logger = require('./app/logger');
const cors = require('cors');

const cas = new CASAuthentication(config.common.cas);

const routesRoot = require('./app/routes/index');
const routesApi = require('./app/routes/api');
const routesAdmin = require('./app/routes/admin');

const init = () => {
  const app = express();
  const port = config.common.port || 8080;
  module.exports = app;

  app.locals.appTitle = config.common.locals.appTitle;

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'app/views'));

  app.use(cors());
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
  app.use(favicon(`${__dirname}/public/icons/favicon.ico`));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/api/', routesApi);
  app.use('/admin/', routesAdmin);
  app.use('/', routesRoot);

  orm.init(app);

  logger.info('Routes initialized');

  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    logger.error(err);
    res.status(err.status);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  logger.info('Error handler initialized');

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
