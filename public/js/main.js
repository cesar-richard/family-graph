let network, nodes, edges, socket;
function objectToArray(obj) {
  return Object.keys(obj).map(function(key) {
    obj[key].id = key;
    return obj[key];
  });
}
function startNetwork() {
  const container = document.getElementById('mynetwork');
  const options = {
    nodes: {
      shape: 'dot',
      size: 16,
      brokenImage: '/img/no-image-icon.png'
    },
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -30,
        centralGravity: 0.004
      },
      solver: 'forceAtlas2Based',
      timestep: 0.2,
      stabilization: {
        enabled: false,
        iterations: 500,
        updateInterval: 25
      }
    }
  };
  $.get('/api/nodes', function(nodelist) {
    $.get('/api/edges', function(edgelist) {
      nodes = new vis.DataSet(nodelist);
      edges = new vis.DataSet(edgelist);
      const data = {
        nodes,
        edges
      };
      network = new vis.Network(container, data, options);
      options.physics.enabled = true;
      network.setOptions(options);
      socket.on('edge add', data => {
        edges.add(data);
      });
      socket.on('node add', data => {
        nodes.add(data);
      });
    });
  });
}
function checkImage(url, callback) {
  const s = document.createElement('IMG');
  s.src = url;
  s.onerror = function() {
    callback(false);
  };
  s.onload = function() {
    callback(true);
  };
}
$(function() {
  socket = io();
  $('.namecomplete').autocomplete({
    source: '/api/getnodes',
    minLength: 3
  });
  $('#add').click(function(event) {
    event.preventDefault();
    const fromTxt = $('#from')
      .val()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const toTxt = $('#to')
      .val()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (fromTxt === '' || toTxt === '') return;
    $.post('/api/getNodeId', { who: fromTxt }, function(nodefrom) {
      fromId = nodefrom.id;
      $.post('/api/getNodeId', { who: toTxt }, function(nodeto) {
        toId = nodeto.id;
        $.post('/api/add', { from: fromId, to: toId }, function(edge) {
          $('#table').bootgrid('append', [
            { id: edge.id, parent: fromTxt, child: toTxt, creator: localLogin, status: 1 }
          ]);
          $('#to').val('');
        });
      });
    });
  });
  $('#graphFindBtn').click(function(event) {
    event.preventDefault();
    const txt = $('#graphSearchInput')
      .val()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (txt === '') return;
    $.post('/api/getNodeId', { who: txt, dryRun: true }, function(data) {
      if (data.id !== null) {
        network.selectNodes( [ data.id ] );
        network.fit({ nodes: [ data.id ] });
      }
    });
  });
  startNetwork();
});
