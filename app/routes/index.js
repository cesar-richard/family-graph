/* eslint no-console: 0 */
const express = require('express');

const router = express.Router();
const fs = require('fs');
const visits = require('../middlewares/visits');

const cas = global.cas;

const orm = require('./../orm');

router.get('/delete', cas.block, visits.delete, function(req, res, next) {
  global.pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM `edges` WHERE `id` = ?;', [req.query.id], function(err3, rows2) {
      if (rows2.length > 0 && rows2[0].creator === req.session[cas.session_name]) {
        connection.query('DELETE FROM `edges` WHERE `id` = ?;', [req.query.id], function(err4, rows3) {
          connection.release();
          res.send({ status: 'success' });
        });
      } else {
        connection.release();
        res.status(404).send({ status: 'fail', message: 'not found' });
      }
    });
  });
});

router.post('/getNodeId', cas.block, function(req, res, next) {
  req.body.shouldcreate =
  typeof req.body.shouldcreate !== 'undefined' || req.body.shouldcreate ? !!req.body.shouldcreate : true;
  global.pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM `nodes` WHERE `label` like ?;', [req.body.who], function(err2, rows) {
      connection.release();
      if (rows.length > 0) {
        res.send({ status: 'success', method: 'find', id: rows[0].id });
      } else {
        if (req.body.shouldcreate) {
          global.pool.getConnection(function(err3, connection2) {
            connection2.query('INSERT INTO `nodes` (`label`) VALUES (?);', [req.body.who], function(
              err4,
              rows2
              ) {
              connection2.release();
              global.io.emit('node add', {
                id: rows2.insertId,
                label: req.body.who,
                color: { background: '#F03967', border: '#713E7F' }
              });
              res.status(201).send({ status: 'success', method: 'create', id: rows2.insertId });
            });
          });
        } else {
          res.status(404).send({ status: 'fail', message: 'node not found' });
        }
      }
    });
  });
});

router.get('/', cas.bounce, visits.home, function(req, res, next) {
  //include: [ { all: true } ]
  global.pool.getConnection(function(err, connection) {
    connection.query(
      'SELECT `edges`.`id`,`n1`.`label` as `from`,`n2`.`label` as `to`,`edges`.`creator`,`edges`.`updatedAt` FROM `edges`,`nodes` as `n1`, `nodes` as `n2` WHERE `edges`.`from` = `n1`.`id` AND `edges`.`to` = `n2`.`id` ORDER BY `from`, `to`;',
      function(err3, rows2) {
        connection.release();
        res.render('form.html.twig', { links: rows2, user: req.session[cas.session_name] });
      });
  });
});

router.get('/getnodes', function(req, res, next) {
  orm.models.nodes.findAll({where: {label: {[Op.iLike]: `%${req.query.term}%`}}}).then((nodes)=>{
    res.send(nodes);
  });
});

router.post('/add', cas.block, function(req, res, next) {
  orm.models.edges.create({from: req.body.from, to: req.body.to, creator: req.session[cas.session_name]})
  .then(edge=>{
    console.log(edge);
    global.io.emit('edge add', {
      id: edge.id,
      from: req.body.from,
      to: req.body.to,
      arrows: 'to',
      color: { color: 'green' }
    });
    res.send({ status: 'success', id: rows.insertId, from: req.body.from, to: req.body.to });
  }).catch(err=>{
    res.status(500).send({status: 'fail', error: err});
  });
});

router.get('/view', cas.bounce, visits.view, function(req, res, next) {
  res.render('view.html.twig', { user: req.session[cas.session_name] });
});

router.get('/nodes', cas.block, function(req, res, next) {
  orm.models.nodes.findAll().then((nodes)=>{
    res.send(nodes);
  });
});

router.get('/edges', cas.block, function(req, res, next) {
  orm.models.edges.findAll().then((edges)=>{
    edges.forEach(function(edge, index) {
      edges[index].dashes = edge.dashes !== 0;
    });
    res.send(edges);
  });
});

router.post('/udpateNodePos', cas.block, visits.updatePos, function(req, res, next) {
  orm.models.node.update({
    x: req.body.x,
    y: req.body.y
  },
  {
    where: {
      id: {
        [Op.eq]: req.body.id
      }
    }
  }).then(()=>{
    res.send({ status: 'success', id: req.body.id })
  })
  .catch((err)=>{
    res.status(404);
    res.send({ status: 'fail', error: err });
  });
});

module.exports = router;
