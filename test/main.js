const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

global.io = { emit(a, b) {} };

function generateName() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

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