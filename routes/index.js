var express = require('express');
var router  = express.Router();
var fs		= require('fs');
function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i].id == obj) {
			return true;
		}
	}

	return false;
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/auth/facebook');
});

router.get('/ok', function(req, res, next) {
	res.render('index.html.twig', {user: req.user});
});

router.get('/graph', function(req, res, next) {
	res.render('graph.html.twig', {user: req.user});
});

router.get('/confid', function(req, res, next) {
	res.render('confid.html.twig');
});

router.get('/getnodes',  function(req, res, next) {
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("SELECT `from` as `label` FROM `parrain` WHERE `from` LIKE ? UNION SELECT `to` FROM `parrain` WHERE `to` LIKE ? ORDER BY `label` ASC;", ['%'+req.query.term+'%','%'+req.query.term+'%'], function(err, rows) {
			if(err)
				console.error(err);
			connection.release();
			res.send(JSON.stringify(rows));
		});
	});
});

router.get('/delete', cas.block, function(req, res, next) {
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("INSERT INTO `visits` (`username`,`route`) VALUES (?,?);", [req.session[ cas.session_name ],'delete'], function(err, rows) {
			if(err)
				console.error(err);
			connection.query("SELECT * FROM `edges` WHERE `id` = ?;", [req.query.id], function(err, rows) {
				if(err)
					console.error(err);
				if (rows.length>0) {
					if(rows[0].creator == req.session[ cas.session_name]){
						connection.query("DELETE FROM `edges` WHERE `id` = ?;", [req.query.id], function(err, rows) {
							if(err)
								console.error(err);
							connection.release();
							res.send({"status":"success"});
						});
					}else{
						connection.release();
						res.send({"status":"fail"});
					}
				}else{
					connection.release();
					res.send({"status":"fail"});
				}
			});
		});
	});
});

/*
router.get('/order', function(req, res, next) {
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("SELECT * FROM `parrain` ORDER BY `UPDATED_AT` ASC;", function(err, links) {
			if(err)
				console.error(err);
			links.forEach(function(link, index){
				global.pool.getConnection(function(err, connection2) {
					if(err){
						console.error(err);
						return;
					}
					connection2.query("SELECT * FROM `nodes` WHERE `label` like ?;",[link.from.normalize('NFD').replace(/[\u0300-\u036f]/g, "")], function(err, fromNode) {
						global.pool.getConnection(function(err, connection3) {
							connection3.query("SELECT * FROM `nodes` WHERE `label` like ?;",[link.to.normalize('NFD').replace(/[\u0300-\u036f]/g, "")], function(err, toNode) {
								console.log(link.to.normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
								if(err){
									console.error(err);
									return;
								}
								global.pool.getConnection(function(err, connection4) {
									connection4.query("INSERT INTO `edges` (`from`,`to`,`creator`,`UPDATED_AT`) VALUES (?,?,?,?);",[fromNode[0].id,toNode[0].id,link.creator,link.UPDATED_AT], function(err, results) {
										if(err){
											console.log("link = " + link.from + " to " + link.to);
											console.log(fromNode,toNode);
											console.error(err);
											console.error(this.sql);
										}else{
											console.log(results.insertId);
										}
										connection4.release();
									});
								});
							});
							connection3.release();
						});
					});
					connection2.release();
				});
			});
			connection.release();
			res.send({"success": true});
		});
	});
});
*/

router.post("/getNodeId", cas.block,  function(req, res, next) {
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("SELECT * FROM `nodes` WHERE `label` like ?;",[req.body.who], function(err, rows) {
			if(err)
				console.error(err);
			connection.release();
			if(rows.length>0){
				res.send({"status":"success","method":"find","id":rows[0].id});
			}
			else{
				global.pool.getConnection(function(err, connection2) {
					if(err){
						console.error(err);
						return;
					}
					connection2.query("INSERT INTO `nodes` (`label`) VALUES (?);",[req.body.who], function(err, rows2) {
						connection2.release();
						if(err)
							console.error(err);
						res.send({"status":"success","method":"create","id":rows2.insertId});
					});
				});
			}
		});
	});
});

router.get('/add', cas.bounce, function(req, res, next) {
	console.log("Add for "+req.session[ cas.session_name ]);
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("INSERT INTO `visits` (`username`,`route`) VALUES (?,?);", [req.session[ cas.session_name ],'add'], function(err, rows) {
			if(err)
				console.error(err);
			connection.query("SELECT `edges`.`id`,`n1`.`label` as `from`,`n2`.`label` as `to`,`edges`.`creator`,`edges`.`UPDATED_AT` FROM `edges`,`nodes` as `n1`, `nodes` as `n2` WHERE `edges`.`from` = `n1`.`id` AND `edges`.`to` = `n2`.`id` ORDER BY `from`, `to`;", function(err, rows) {
				if(err)
					console.error(err);
				connection.release();
				res.render('form.html.twig',{links:rows,user:req.session[ cas.session_name ]});
			});
		});
	});
});

router.post('/add',  function(req, res, next) {
	console.log("Added by "+req.session[ cas.session_name ]);
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("INSERT INTO `edges` (`from`,`to`,`creator`) VALUES (?,?,?);", [req.body.from,req.body.to,req.session[ cas.session_name ]], function(err, rows) {
			if(err)
				console.error(err);
			connection.release();
			res.send({"status":"success","id":rows.insertId,"from": req.body.from, "to": req.body.to});
		});
	});

});

router.get('/view', cas.bounce, function(req, res, next) {
	console.log("View for "+req.session[ cas.session_name ]);
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("INSERT INTO `visits` (`username`,`route`) VALUES (?,?);", [req.session[ cas.session_name ],'view'], function(err, rows) {
			if(err)
				console.error(err);
			connection.release();
			res.render('test.html.twig', {user:req.session[ cas.session_name ]});
		});
	});
});

/*router.get('/datas', cas.bounce, function(req, res, next) {
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("SELECT `from`,`to` FROM `parrain` ORDER BY `from`,`to`;", function(err, rows) {
			if(err)
				console.error(err);
			connection.release();
			var nodes="dinetwork {";
			rows.forEach(function(item, index){
				nodes=nodes + '"' + item.from + '"->"' + item.to + '";';
			});
			nodes = nodes+"}";
			res.send(nodes);
		});
	});
});*/


router.get('/nodes', cas.block, function(req, res, next) {
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("SELECT * FROM `nodes`;", function(err, nodes) {
			if(err)
				console.error(err);
			connection.release();
			res.send(nodes);
		});
	});
});

router.get('/edges', cas.block, function(req, res, next) {
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("SELECT * FROM `edges`;", function(err, edges) {
			if(err)
				console.error(err);
			connection.release();
			res.send(edges);
		});
	});
});

router.post('/udpateNodePos', cas.block, function(req, res, next) {
	console.log("Position " + req.body.id + " updated by " + req.session[ cas.session_name ]);
	global.pool.getConnection(function(err, connection) {
		if(err){
			console.error(err);
			return;
		}
		connection.query("UPDATE `nodes` SET `x` = ?,`y` = ? WHERE `id` =?;", [req.body.x,req.body.y,req.body.id], function(err, rows) {
			connection.release();
			if(err){
				console.error(err);
				res.send({"status":"fail","id":req.body.id});
			}else{
				res.send({"status":"success","id":req.body.id});
			}
		});
	});
});

module.exports = router;
