const express = require('express');
const config = require('../../config');
const CASAuthentication = require('cas-authentication');

const router = express.Router();
const fs = require('fs');
const visits = require('../middlewares/visits');

const cas = new CASAuthentication(config.common.cas);

const orm = require('../orm');

router.get('/', cas.bounce, visits.view, function(req, res, next) {
  res.render('admin_home', { pagetitle: 'Dashboard', user: req.session[cas.session_name] });
});

router.get('/nodes', cas.bounce, visits.view, function(req, res, next) {
	orm.models.nodes
    .findAll({ include: [{ all: true }] })
    .then(nodes => {
      res.render('admin_nodes', { pagetitle: 'Nodes', nodes: nodes, user: req.session[cas.session_name] });
    })
    .catch(orm.errorHandler);
});

router.get('/edges', cas.bounce, visits.view, function(req, res, next) {
  res.render('admin_edges', { pagetitle: 'Edges', user: req.session[cas.session_name] });
});

router.get('/logs', cas.bounce, visits.view, function(req, res, next) {
  res.render('admin_logs', { pagetitle: 'Logs', user: req.session[cas.session_name] });
});

module.exports = router;