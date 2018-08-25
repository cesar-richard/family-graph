$(function(){
	$("#save").click(function(event) {
		event.preventDefault();
		var nodes = objectToArray(network.getPositions());
		nodes.forEach(function(node, index){
			$.post( '/api/updateNodePos',{"id": node.id, "x": node.x, "y":node.y}, function(res) { });
		});
	});
	$("#updateLogins").click(function(event) {
		event.preventDefault();
		$.get( '/api/nodes', function(nodes) {
			nodes.forEach(function(node, index){
				if(!node.image){
					var firstName = node.label.split(' ').slice(0, -1).join(' ');
					var lastName = node.label.split(' ').slice(-1).join(' ');
					$.get( 'http://assos.utc.fr/nuitfauve/find.php',{ "key": 'nf16enculey', 'prenom': firstName, 'nom': lastName }, function(findData) {
						if(findData){
							checkImage('https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username='+findData.login, (utcData)=> {
								if(utcData===true)
									$.get( '/api/updateLogin',{"id": node.id, "login": findData.login}, function(res) {});
							});
						}
					});
				}
			});
		});
	});
});