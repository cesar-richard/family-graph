const express = require('express');
const config = require('../../config');
const CASAuthentication = require('cas-authentication');

const router = express.Router();
const fs = require('fs');
const visits = require('../middlewares/visits');

const cas = new CASAuthentication(config.common.cas);

const orm = require('../orm');

router.get('/', cas.bounce, visits.home, function(req, res, next) {
  orm.models.edges
    .findAll({ include: [{ all: true }] })
    .then(edges => {
      res.render('index', { links: edges, user: req.session[cas.session_name] });
    })
    .catch(orm.errorHandler);
});

router.get('/view', cas.bounce, visits.view, function(req, res, next) {
  res.render('view', { user: req.session[cas.session_name] });
});

module.exports = router;
