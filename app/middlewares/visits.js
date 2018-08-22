const config = require('../../config'),
  logger = require('../logger'),
  CASAuthentication = require('cas-authentication'),
  orm = require('../orm'),
// cas = global.cas;
  cas = new CASAuthentication(config.common.cas);

function visit(route, req, res, next) {
  logger.info(`${route} for ${req.session[cas.session_name]}`);
  orm.models.visits
    .create({ username: req.session[cas.session_name], route: route })
    .then(() => {
      next();
      return null;
    })
    .catch(err => {
      res.status(500).send(err);
    });
      //next();
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

exports.admin_home = (req, res, next) => {
  visit(`Admin home`, req, res, next);
};

exports.admin_nodes = (req, res, next) => {
  visit(`Admin nodes`, req, res, next);
};

exports.admin_edges = (req, res, next) => {
  visit(`Admin edges`, req, res, next);
};

exports.admin_logs = (req, res, next) => {
  visit(`Admin logs`, req, res, next);
};
