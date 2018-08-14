const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

function generateName() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

describe('API', () => {
  describe('POST /api/getNodeId', () => {
    const nodeName = generateName();

    it('should return 400 if mandatory parameters are not given', done => {
      chai
        .request(server)
        .post('/api/getNodeId')
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('fail');
          res.body.should.have.property('message').that.equals('mandatory parameters missing');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });

    it('should create node and return 201', done => {
      chai
        .request(server)
        .post('/api/getNodeId')
        .send({ who: nodeName })
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('success');
          res.body.should.have.property('method').that.equals('create');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });

    it('should find node and return 200', done => {
      chai
        .request(server)
        .post('/api/getNodeId')
        .send({ who: nodeName })
        .then(node => {
          chai
            .request(server)
            .post('/api/getNodeId')
            .send({ who: nodeName })
            .then(res => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.property('status').that.equals('success');
              res.body.should.have.property('method').that.equals('find');
              dictum.chai(res);
            })
            .then(() => done())
            .catch(err => {
              done(new Error(err));
            });
        });
    });

    it('should not find any node and return 404', done => {
      chai
        .request(server)
        .post('/api/getNodeId')
        .send({ who: 'NOTHINGATALL', shouldcreate: false })
        .then(res => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('fail');
          res.body.should.have.property('message').that.equals('node not found');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('GET /api/getnodes', () => {
    it('should return 400 if mandatory parameters are not given', done => {
      chai
        .request(server)
        .get('/api/getnodes')
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('fail');
          res.body.should.have.property('message').that.equals('mandatory parameters missing');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });

    it('should return node array containing node', done => {
      const nodeName = generateName();
      chai
        .request(server)
        .post('/api/getNodeId')
        .send({ who: nodeName })
        .then(node => {
          chai
            .request(server)
            .get('/api/getnodes')
            .query({ term: nodeName })
            .then(res => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body[0].should.have.property('label').that.equals(nodeName);
              dictum.chai(res);
            })
            .then(() => done())
            .catch(err => {
              done(new Error(err));
            });
        });
    });
  });

  describe('POST /api/add', () => {
    it('should return 400 if mandatory parameters are not given', done => {
      chai
        .request(server)
        .post('/api/add')
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('fail');
          res.body.should.have.property('message').that.equals('mandatory parameters missing');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });

    it('should add edge and return 200', done => {
      chai
        .request(server)
        .post('/api/add')
        .send({ from: 1, to: 1 })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('success');
          res.body.should.have.property('id');
          res.body.should.have.property('from');
          res.body.should.have.property('to');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('GET /api/nodes', () => {
    it('should return nodes list', done => {
      chai
        .request(server)
        .get('/api/nodes')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('GET /api/edges', () => {
    it('should return edges list', done => {
      chai
        .request(server)
        .get('/api/edges')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('GET /api/delete', () => {
    it('should return 400 if mandatory parameters are not given', done => {
      chai
        .request(server)
        .get('/api/delete')
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('fail');
          res.body.should.have.property('message').that.equals('mandatory parameters missing');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });

    it('should delete edge and return 200', done => {
      chai
        .request(server)
        .get('/api/edges')
        .then(edges => {
          chai
            .request(server)
            .get('/api/delete')
            .query({ id: edges.body[0].id })
            .then(res => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.property('status').that.equals('success');
              dictum.chai(res);
            })
            .then(() => done())
            .catch(err => {
              done(new Error(err));
            });
        });
    });

    it('should return 404', done => {
      chai
        .request(server)
        .get('/api/delete')
        .query({ id: 1001 })
        .then(res => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('fail');
          res.body.should.have.property('message').that.equals('not found');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });
});
