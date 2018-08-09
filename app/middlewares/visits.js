const logger = require('../logger'),
  orm = require('../orm'),
  cas = global.cas;

function visit(route, req, res, next) {
  next();
  /*
  logger.info(`${route} for ${req.session[cas.session_name]}`);
  next();
  orm.models.visits
    .create({ username: req.session[cas.session_name], route: route })
    .then(() => {
      next();
      return null;
    })
    .catch(err => {
      res.status(500).send(err);
    });
    */
}

exports.home = (req, res, next) => {
  visit('home', req, res, next);
};

exports.view = (req, res, next) => {
  visit('view', req, res, next);
};

exports.delete = (req, res, next) => {
  visit('delete', req, res, next);
};

exports.updatePos = (req, res, next) => {
  visit(`Position update ${req.body.id}`, req, res, next);
};
