const express = require('express');
const config = require('../../config');
const CASAuthentication = require('cas-authentication');

const router = express.Router();
const fs = require('fs');
const visits = require('../middlewares/visits');

const cas = new CASAuthentication(config.common.cas);

const orm = require('../orm');

router.get('/', cas.bounce, visits.admin_home, function(req, res, next) {
  res.render('admin_home', { pagetitle: 'Dashboard', user: req.session[cas.session_name] });
});

router.get('/nodes', cas.bounce, visits.admin_nodes, function(req, res, next) {
  orm.models.nodes
    .findAll({ include: [{ all: true }] })
    .then(nodes => {
      res.render('admin_nodes', { pagetitle: 'Nodes', nodes, user: req.session[cas.session_name] });
    })
    .catch(orm.errorHandler);
});

router.get('/edges', cas.bounce, visits.admin_edges, function(req, res, next) {
  orm.models.edges
    .findAll({ include: [{ all: true }] })
    .then(edges => {
      res.render('admin_edges', { pagetitle: 'Edges', edges, user: req.session[cas.session_name] });
    })
    .catch(orm.errorHandler);
});

router.get('/logs', cas.bounce, visits.admin_logs, function(req, res, next) {
  orm.models.visits
    .findAll({ include: [{ all: true }] })
    .then(logs => {
      res.render('admin_logs', { pagetitle: 'Logs', logs, user: req.session[cas.session_name] });
    })
    .catch(orm.errorHandler);
});

module.exports = router;
