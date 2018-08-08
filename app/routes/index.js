/* eslint no-console: 0 */
const express = require('express');
const config = require('../../config');

const router = express.Router();
const fs = require('fs');
const visits = require('../middlewares/visits');

const cas = new CASAuthentication(config.common.cas);

const orm = require('../orm');

router.get('/delete', cas.block, visits.delete, function(req, res, next) {
  let condition = { where: { id: req.query.id, creator: req.session[cas.session_name] } };
  if (req.session[cas.session_name] === 'cerichar') condition = { where: { id: req.query.id } };
  orm.models.edges
    .findOne(condition)
    .then(edge => {
      if (edge === null) res.status(404).send({ status: 'fail', message: 'not found' });
      else {
        edge.destroy();
        res.send({ status: 'success' });
      }
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

router.post('/getNodeId', cas.block, function(req, res, next) {
  req.body.shouldcreate =
    typeof req.body.shouldcreate !== 'undefined' || req.body.shouldcreate ? !!req.body.shouldcreate : true;
  orm.models.nodes
    .findAll({ where: { label: { [orm.Op.like]: `%${req.body.who}%` } } })
    .then(nodes => {
      if (nodes.length > 0) {
        res.send({ status: 'success', method: 'find', id: nodes[0].id });
      } else {
        if (req.body.shouldcreate) {
          orm.models.nodes
            .create({
              label: req.body.who,
              creator: req.session[cas.session_name]
            })
            .then(node => {
              global.io.emit('node add', {
                id: node.id,
                label: req.body.who,
                color: { background: '#F03967', border: '#713E7F' }
              });
              res.status(201).send({ status: 'success', method: 'create', id: node.id });
            })
            .catch(err => {
              res.status(500).send({ status: 'fail', error: err });
            });
        } else {
          res.status(404).send({ status: 'fail', message: 'node not found' });
        }
      }
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

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

router.get('/getnodes', function(req, res, next) {
  orm.models.nodes
    .findAll({ where: { label: { [orm.Op.like]: `%${req.query.term}%` } } })
    .then(nodes => {
      res.send(nodes);
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

router.post('/add', cas.block, function(req, res, next) {
  orm.models.edges
    .create({
      from: req.body.from,
      to: req.body.to,
      creator: req.session[cas.session_name]
    })
    .then(edge => {
      global.io.emit('edge add', {
        id: edge.id,
        from: req.body.from,
        to: req.body.to,
        arrows: 'to',
        color: { color: 'green' }
      });
      res.send({ status: 'success', id: edge.id, from: req.body.from, to: req.body.to });
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

router.get('/view', cas.bounce, visits.view, function(req, res, next) {
  res.render('view.html.twig', { user: req.session[cas.session_name] });
});

router.get('/nodes', cas.block, function(req, res, next) {
  //TODO add get test with login
  //TODO add weez api get for login ? manual by admin
  //TODO use brokenImage: for fallback images
  orm.models.nodes
    .findAll()
    .then(nodes => {
      res.send(nodes);
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

router.get('/edges', cas.block, function(req, res, next) {
  orm.models.edges
    .findAll()
    .then(edges => {
      edges.forEach(function(edge, index) {
        edges[index].dashes = edge.dashes !== 0;
      });
      res.send(edges);
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

router.post('/udpateNodePos', cas.block, visits.updatePos, function(req, res, next) {
  orm.models.nodes
    .update(
      {
        x: req.body.x,
        y: req.body.y
      },
      {
        where: {
          id: req.body.id
        }
      }
    )
    .then(result => {
      if (result[0] === 0) res.status(404).send({ status: 'fail', error: 'not found' });
      else res.send({ status: 'success', id: req.body.id });
    })
    .catch(err => {
      res.status(500).send({ status: 'fail', error: err });
    });
});

module.exports = router;
