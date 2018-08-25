var network,nodes,edges,socket;
function objectToArray(obj) {
	return Object.keys(obj).map(function (key) {
		obj[key].id = key;
		return obj[key];
	});
}
function startNetwork() {
	var container = document.getElementById('mynetwork');
	var  options = {
		nodes: {
			shape: 'dot',
			size: 16,
			brokenImage: '/img/no-image-icon.png'
		},
		physics: {
			forceAtlas2Based: {
				gravitationalConstant: -30,
				centralGravity: 0.004,
			},
			solver: 'forceAtlas2Based',
			timestep: 0.2,
			stabilization: {
				enabled:false,
				iterations:500,
				updateInterval:25
			}
		}
	};
	$.get( '/api/nodes', function(nodelist) {
		$.get( '/api/edges', function(edgelist) {
			nodes = new vis.DataSet(nodelist);
			edges = new vis.DataSet(edgelist);
			var data = {
				nodes: nodes,
				edges: edges
			}
			network = new vis.Network(container, data, options);
			options.physics.enabled=true;
			network.setOptions(options);
			socket.on('edge add', data=>{edges.add(data)});
			socket.on('node add', data=>{nodes.add(data)});
		});
	});
}
function checkImage(url,callback){
	var s = document.createElement("IMG");
	s.src = url
	s.onerror = function(){
		callback(false);
	}
	s.onload = function(){
		callback(true);
	}
}
$(function(){
	socket = io();
	$( ".namecomplete" ).autocomplete({
		source: "/api/getnodes",
		minLength: 3
	});
	$( "#add" ).click(function(event) {
		event.preventDefault();
		var fromTxt = $("#from").val().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		var toTxt = $("#to").val().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		if(fromTxt=="" || toTxt=="")
			return;
		$.post( '/api/getNodeId',{ who: fromTxt}, function (nodefrom){
			fromId=nodefrom.id;
			$.post( '/api/getNodeId',{ who: toTxt}, function (nodeto){
				toId=nodeto.id;
				$.post( '/api/add',{ from: fromId, to: toId }, function(edge) {
					$("#table").bootgrid("append",[{ "id":edge.id, "parent":fromTxt, "child":toTxt, "creator":localLogin, "status":1 }]);
					$("#to").val("");
				});
			});
		});
	});
	$("#graphFindBtn").click(function(event) {
		event.preventDefault();
		var txt = $("#graphSearchInput").val().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		if(txt=="")
			return;
		$.post( '/api/getNodeId',{ who: txt, shouldcreate: false}, function (data){
			if(data.id!==null){
				network.selectNodes([data.id]);
				network.fit({nodes:[data.id]});
			}
		});
	});
	startNetwork();
});