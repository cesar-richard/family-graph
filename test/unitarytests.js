const chai = require('chai'),
dictum = require('dictum.js'),
server = require('./../app'),
router = require('express').Router(),
orm = require('./../app/orm'),
should = chai.should();

global.io = { emit(a, b) {} };

function generateName() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
}

describe('Unit Functions', () => {
	describe('ORM Error Handler', () => {
		it('should return 500 on unhandled error', done => {
			chai
			.request(server)
			.get('/api/checkError')
			.then(res => {
				res.should.have.status(500);
				res.should.be.json;
				res.body.should.have.property('status').that.equals('fail');
				res.body.should.have.property('message').that.equals('FakeError');
				dictum.chai(res);
			})
			.then(() => done())
			.catch(err => {
				done(new Error(err));
			});
		});
	});
});
