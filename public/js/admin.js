$(function() {
  $('#save').click(function(event) {
    event.preventDefault();
    const nodes = objectToArray(network.getPositions());
    nodes.forEach(function(node, index) {
      $.post('/api/updateNodePos', { id: node.id, x: node.x, y: node.y }, function(res) {});
    });
  });
  $('#updateLogins').click(function(event) {
    event.preventDefault();
    $.get('/api/nodes', function(nodes) {
      nodes.forEach(function(node, index) {
        if (!node.image) {
          const firstName = node.label
            .split(' ')
            .slice(0, -1)
            .join(' ');
          const lastName = node.label
            .split(' ')
            .slice(-1)
            .join(' ');
          $.get(
            'http://assos.utc.fr/nuitfauve/find.php',
            { key: 'nf16enculey', prenom: firstName, nom: lastName },
            function(findData) {
              if (findData) {
                $.get('/api/updateLogin', { id: node.id, login: findData.login }, function(res) {
                  const url = `https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username=${
                    findData.login
                  }`;
                  checkImage(url, utcData => {
                    if (utcData === true) $.get('/api/updatePicture', { id: node.id, url }, function(res) {});
                  });
                });
              }
            }
          );
        }
      });
    });
  });
});
