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
			connection.query("SELECT * FROM `parrain` WHERE `id` = ?;", [req.query.id], function(err, rows) {
				if(err)
					console.error(err);
				if (rows.length>0) {
					if(rows[0].creator == req.session[ cas.session_name]){
						connection.query("DELETE FROM `parrain` WHERE `id` = ?;", [req.query.id], function(err, rows) {
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
			connection.query("SELECT `id`,`from`,`to`,`creator` FROM `parrain` ORDER BY `from`,`to`;", function(err, rows) {
				if(err)
					console.error(err);
				connection.release();
				res.render('form.html.twig',{links:rows,user:req.session[ cas.session_name ]});
			});
		});
	});
});

router.post('/add',  function(req, res, next) {
	console.log(req.body);
	console.log("Added by "+req.session[ cas.session_name ]);
	if(req.body.from!=""&&req.body.to!=""){
		global.pool.getConnection(function(err, connection) {
			if(err){
				console.error(err);
				return;
			}
			var orig = req.body.from.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			var dest = req.body.to.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			connection.query("INSERT INTO `parrain` (`from`,`to`,`creator`) VALUES (?,?,?);", [orig,dest,req.session[ cas.session_name ]], function(err, rows) {
				if(err)
					console.error(err);
				connection.release();
				res.send({"status":"success","id":rows.insertId,"from": orig, "to": dest});
			});
		});
	}else{
		res.redirect('/add');
	}
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
			res.render('test.html.twig');
		});
	});
});

router.get('/datas', cas.bounce, function(req, res, next) {
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
});

module.exports = router;
