// const dotenv = require('dotenv').config({ path: `${__dirname}/.env` });
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const configFile = `./${ENVIRONMENT}`;
const mysql = require('mysql');

const isObject = variable => {
  return variable instanceof Object;
};

const assignObject = (target, source) => {
  if (target && isObject(target) && source && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = source[key];
      } else {
        assignObject(target[key], source[key]);
      }
    });
    return target;
  }
};

const config = {
  logger: {
    level: 'info'
  },
  common: {
    debug: true,
    port: 3651,
    locals: {
      appTitle: "Genealog'Utc"
    },
    database: {
      host: process.env.sqlhost,
      port: process.env.NODE_API_DB_PORT,
      database: process.env.MYSQL_DATABASE,
      username: process.env.sqluser,
      password: process.env.MYSQL_ROOT_PASSWORD,
      dialect: 'mysql'
    },
    session: {
      header_name: 'authorization',
      secret: process.env.NODE_API_SESSION_SECRET
    },
    cas: {
      cas_url: 'https://cas.utc.fr/cas',
      service_url: 'http://dev.crichard.fr/',
      cas_version: '2.0',
      session_info: 'cas_infos'
    }
  }
};

const customConfig = require(configFile).config;
module.exports = assignObject(customConfig, config);
