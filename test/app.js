'use strict';

const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http');
  //Sequelize = require('sequelize'),
  //models = require('../app/models'),
  //orm = require('../app/orm'),
  //dataCreation = require('../app/models/scripts/dataCreation');

chai.use(chaiHttp);

const normalizedPath = path.join(__dirname, '.');
const data = [];
fs.readdirSync(normalizedPath).forEach(file => {
  data.push(new Promise(() => require(`./${file}`)));
});
Promise.resolve().then(() => Promise.all(data));