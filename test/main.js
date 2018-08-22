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
  describe('Public', () => {
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
  describe('Admin', () => {
    describe('/admin/', () => {
      it('should return admin home page', done => {
        chai
        .request(server)
        .get('/admin/')
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
    describe('/admin/nodes', () => {
      it('should return admin nodes page', done => {
        chai
        .request(server)
        .get('/admin/nodes')
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
    describe('/admin/edges', () => {
      it('should return admin edges page', done => {
        chai
        .request(server)
        .get('/admin/edges')
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
    describe('/admin/logs', () => {
      it('should return admin logs page', done => {
        chai
        .request(server)
        .get('/admin/logs')
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