const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

global.io = { emit(a, b) {} };

describe('HTML', () => {
  describe('/NOTHINGATALL', () => {
    it('should return 404 page', done => {
      chai
        .request(server)
        .get('/NOTHINGATALL')
        .then(res => {
          res.should.have.status(404);
          res.should.be.html;
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('/', () => {
    it('should return home page', done => {
      chai
        .request(server)
        .get('/')
        .then(res => {
          res.should.have.status(200);
          res.should.be.html;
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('/view', () => {
    it('should return graph page', done => {
      chai
        .request(server)
        .get('/view')
        .then(res => {
          res.should.have.status(200);
          res.should.be.html;
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });
});

describe('API', () => {
  describe('/getNodeId', () => {
    it('should create node and return 201', done => {
      chai
        .request(server)
        .post('/getNodeId')
        .send({ who: 'B' })
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
        .post('/getNodeId')
        .send({ who: 'B' })
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

  describe('/getnodes', () => {
    it('should return node array containing node', done => {
      chai
        .request(server)
        .get('/getnodes')
        .query({ term: 'B' })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].should.have.property('label').that.equals('B');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('/add', () => {
    it('should find node and return 200', done => {
      chai
        .request(server)
        .post('/add')
        .send({ from: 'AA', to: 'AB' })
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

  describe('/nodes', () => {
    it('should return nodes list', done => {
      chai
        .request(server)
        .get('/nodes')
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

  describe('/edges', () => {
    it('should return edges list', done => {
      chai
        .request(server)
        .get('/edges')
        .query({ id: 1 })
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

  describe('/delete', () => {
    it('should delete edge and return 200', done => {
      chai
        .request(server)
        .get('/delete')
        .query({ id: 1 })
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

    it('should return 404', done => {
      chai
        .request(server)
        .get('/delete')
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

  describe('/udpateNodePos', () => {
    it('should update node position and return 200', done => {
      chai
        .request(server)
        .post('/udpateNodePos')
        .send({ x: 5, y: -5, id: 1 })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('success');
          res.body.should.have.property('id');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });

    it('should return 404', done => {
      chai
        .request(server)
        .post('/udpateNodePos')
        .send({ x: 5, y: -5, id: 1001 })
        .then(res => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.have.property('status').that.equals('fail');
          dictum.chai(res);
        })
        .then(() => done())
        .catch(err => {
          done(new Error(err));
        });
    });
  });
});
