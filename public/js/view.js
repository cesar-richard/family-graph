var network,nodes,edges;
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
			};
			network = new vis.Network(container, data, options);
			options.physics.enabled=true;
			network.setOptions(options);
			socket.on('node add', nodes.add);
			socket.on('edge add', edges.add);
		});
	});
}
$(function(){
	var socket = io();
	startNetwork();
});