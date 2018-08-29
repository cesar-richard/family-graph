const express = require('express');
const config = require('../../config');
const CASAuthentication = require('cas-authentication');

const router = express.Router();
const fs = require('fs');
const visits = require('../middlewares/visits');
const download = require('image-downloader');
const logger = require('../logger');

const cas = new CASAuthentication(config.common.cas);

const orm = require('../orm');

router.get('/delete', cas.block, visits.delete, function(req, res, next) {
  if (!req.query || !req.query.id)
    return res.status(400).send({ status: 'fail', message: 'mandatory parameters missing' });
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
  if (!req.body || !req.body.who)
    return res.status(400).send({ status: 'fail', message: 'mandatory parameters missing' });
  req.body.dryRun = typeof req.body.dryRun === 'undefined' ? false : req.body.dryRun;
  logger.info(req.body);
  orm.models.nodes
  .findAll({ where: { label: { [orm.Op.like]: `%${req.body.who}%` } } })
  .then(nodes => {
    if (nodes.length > 0) {
      return res.send({ status: 'success', method: 'find', id: nodes[0].id });
    } else {
      if (!req.body.dryRun) {
        return orm.models.nodes
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
          return res.status(201).send({ status: 'success', method: 'create', id: node.id });
        })
        .catch(orm.errorHandler);
      } else {
        return res.status(404).send({ status: 'fail', message: 'node not found' });
      }
    }
  })
  .catch(orm.errorHandler);
});

router.get('/getnodes', function(req, res, next) {
  if (!req.query || !req.query.term)
    return res.status(400).send({ status: 'fail', message: 'mandatory parameters missing' });
  orm.models.nodes
  .findAll({ where: { label: { [orm.Op.like]: `%${req.query.term}%` } } })
  .then(nodes => {
    res.send(nodes);
  })
  .catch(orm.errorHandler);
});

router.post('/add', cas.block, function(req, res, next) {
  if (!req.body || !req.body.from || !req.body.to)
    return res.status(400).send({ status: 'fail', message: 'mandatory parameters missing' });
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
  if (!req.body || !req.body.x || !req.body.y || !req.body.id)
    return res.status(400).send({ status: 'fail', message: 'mandatory parameters missing' });
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
  if (!req.query || !req.query.id || !req.query.login)
    return res.status(400).send({ status: 'fail', message: 'mandatory parameters missing' });
  orm.models.nodes
  .update(
  {
    shape: 'image',
    login: req.query.login
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

router.get('/checkError', function(req, res, next) {
  orm.errorHandler('FakeError', req, res, next);
});

router.get('/updatePicture', function(req, res, next) {
  if (!req.query || !req.query.id || !req.query.url)
    return res.status(400).send({ status: 'fail', message: 'mandatory parameters missing' });
  const options = {
    url: req.query.url, //`https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username=${req.query.login}`,
    dest: `public/img/users/${req.query.login}.jpg`
  };
  orm.models.nodes.findById(req.query.id).then(node => {

    download
    .image(options)
    .then(({ filename, image }) => {
      logger.info('User photo saved to', filename, ' OR ');
      orm.models.nodes
      .update(
      {
        image: `/img/users/${req.query.login}.jpg`
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
    })
    
  })
  .catch(err => {
    logger.error(err);
  });;
});

router.get('/checkError', function(req, res, next) {
  orm.errorHandler('FakeError', req, res, next);
});

module.exports = router;
