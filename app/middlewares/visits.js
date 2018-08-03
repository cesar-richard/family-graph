// const errors = require('../errors');
const logger = require('../logger'),
  cas = global.cas,
  orm = require('../orm');

function visit(route, req, res, next) {
  logger.info(`${route} for ${req.session[cas.session_name]}`);
  orm.models.visits
    .create({ username: req.session[cas.session_name], route })
    .then(() => {
      next();
    })
    .catch(err => {
      res.status(500).send(err);
    });
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
