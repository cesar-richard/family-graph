/* eslint no-console: 0 */
const express = require('express');
const config = require('../../config');
const CASAuthentication = require('cas-authentication');

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
    .catch(orm.errorHandler);
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
    .catch(orm.errorHandler);
});

router.get('/getnodes', function(req, res, next) {
  orm.models.nodes
    .findAll({ where: { label: { [orm.Op.like]: `%${req.query.term}%` } } })
    .then(nodes => {
      res.send(nodes);
    })
    .catch(orm.errorHandler);
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
    .catch(orm.errorHandler);
});

router.get('/nodes', cas.block, function(req, res, next) {
  orm.models.nodes
    .findAll()
    .then(nodes => {
      res.send(nodes);
    })
    .catch(orm.errorHandler);
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
    .catch(orm.errorHandler);
});

router.post('/updateNodePos', cas.block, visits.updatePos, function(req, res, next) {
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
    .catch(orm.errorHandler);
});

router.get('/updateLogin', function(req, res, next) {
  orm.models.nodes
    .update(
      {
        shape: 'image',
        image: `https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username=${
          req.query.login
        }`
      },
      {
        where: {
          id: req.query.id
        }
      }
    )
    .then(result => {
      if (result[0] === 0) res.status(404).send({ status: 'fail', error: 'not found' });
      else res.send({ status: 'success', id: req.query.id });
    })
    .catch(orm.errorHandler);
});

module.exports = router;
