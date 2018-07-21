const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

describe('Home', () => {
  describe('HTML', () => {
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
  });
});
