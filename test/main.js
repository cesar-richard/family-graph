const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

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
});
