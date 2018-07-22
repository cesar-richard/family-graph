const edges = require('./edges'),
  nodes = require('./nodes'),
  visits = require('./visits');

exports.define = db => {
  edges.getModel(db);
  nodes.getModel(db);
  visits.getModel(db);

  db.models.edges.associate(db.models);
  db.models.nodes.associate(db.models);
  db.models.visits.associate(db.models);
};
