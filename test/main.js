const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  request = chai.request(server);

describe('HTML', () => {
  describe('/', () => {
    it('should return home page', done => {
      request
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
      request
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
      request
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
      request
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

after(() => request.server.close());