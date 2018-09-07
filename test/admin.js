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

describe('Admin', () => {
  describe('POST /api/updateNodePos', () => {
    describe('should return 400 if mandatory parameters are not given', () => {
      it('should return 400 if no parameters are given', done => {
        chai
          .request(server)
          .post('/api/updateNodePos')
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

      it('should return 400 if x is not given', done => {
        chai
          .request(server)
          .post('/api/updateNodePos')
          .send({ y: 0, id: 1001 })
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

      it('should return 400 if y is not given', done => {
        chai
          .request(server)
          .post('/api/updateNodePos')
          .send({ x: 0, id: 1001 })
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

      it('should return 400 if id is not given', done => {
        chai
          .request(server)
          .post('/api/updateNodePos')
          .send({ x: 0, y: 0 })
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
    });

    it('should update node position and return 200', done => {
      chai
        .request(server)
        .post('/api/getNodeId')
        .send({ who: 'C' })
        .then(node => {
          chai
            .request(server)
            .post('/api/updateNodePos')
            .send({ x: 5, y: -5, id: node.body.id })
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
        })
        .catch(errNode => {
          done(new Error(errNode));
        });
    });

    it('should return 404', done => {
      chai
        .request(server)
        .post('/api/updateNodePos')
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

  describe('GET /api/updateLogin', () => {
    describe('should return 400 if mandatory parameters are not given', () => {
      it('should return 400 if no parameters are given', done => {
        chai
          .request(server)
          .get('/api/updateLogin')
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

      it('should return 400 if login is not given', done => {
        chai
          .request(server)
          .get('/api/updateLogin')
          .query({ id: 1001 })
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

      it('should return 400 if no id is not given', done => {
        chai
          .request(server)
          .get('/api/updateLogin')
          .query({ login: 'fakelogin' })
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
    });

    it('should update node image and return 200', done => {
      chai
        .request(server)
        .post('/api/getNodeId')
        .send({ who: 'fakelogin' })
        .then(node => {
          chai
            .request(server)
            .get('/api/updateLogin')
            .query({ login: 'fakelogin', id: node.body.id })
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
        })
        .catch(errNode => {
          done(new Error(errNode));
        });
    });

    it('should return 404', done => {
      chai
        .request(server)
        .get('/api/updateLogin')
        .query({ login: 'NOTHINGATALL', id: 1001 })
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

  describe('GET /api/updatePicture', () => {
    describe('should return 400 if mandatory parameters are not given', () => {
      it('should return 400 if no parameters are given', done => {
        chai
          .request(server)
          .get('/api/updatePicture')
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

      it('should return 400 if url is not given', done => {
        chai
          .request(server)
          .get('/api/updatePicture')
          .query({ id: 1001 })
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

      it('should return 400 if no id is not given', done => {
        chai
          .request(server)
          .get('/api/updatePicture')
          .query({ url: 'fakeurl' })
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
    });

    it('should update node image and return 200', done => {
      chai
        .request(server)
        .post('/api/getNodeId')
        .send({ who: generateName() })
        .then(node => {
      chai
          .request(server)
          .get('/api/updateLogin')
          .query({ login: 'cerichar', id: node.body.id })
          .then(res1 => {
            chai
            .request(server)
            .get('/api/updatePicture')
            .query({ url: 'http://crichard.fr/no-image-icon.png', id: node.body.id })
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
          })
          .catch(err => {
            done(new Error(err));
          });
        })
        .catch(errNode => {
          done(new Error(errNode));
        });
    });

    it('should return 404', done => {
      chai
        .request(server)
        .get('/api/updatePicture')
        .query({ url: 'http://FAKEURL.com', id: 1001 })
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
