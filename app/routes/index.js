/* eslint no-console: 0 */
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
      res.render('form.html.twig', { links: edges, user: req.session[cas.session_name] });
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

router.get('/view', cas.bounce, visits.view, function(req, res, next) {
  res.render('view.html.twig', { user: req.session[cas.session_name] });
});

module.exports = router;