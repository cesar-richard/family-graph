const dotenv = require('dotenv').config({ path: `${__dirname}/.env` });

const ENVIRONMENT = process.env.NODE_ENV || 'development';

const configFile = `./${ENVIRONMENT}`;

const isObject = variable => {
  return variable instanceof Object;
};

/*
 * Deep copy of source object into tarjet object.
 * It does not overwrite properties.
 */
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
  common: {
    port: 3651,
    database: {
      host: process.env.sqlhost||"localhost",
      port: process.env.NODE_API_DB_PORT||3306,
      name: process.env.MYSQL_DATABASE,
      username: process.env.sqluser||"root",
      password: process.env.MYSQL_ROOT_PASSWORD||"mysql_strong_password",
      dialect: 'mysql'
    },
    session: {
      header_name: 'authorization',
      secret: process.env.NODE_API_SESSION_SECRET||'NobodyEverKnows'
    },
    cas: {
      cas_url: 'https://cas.utc.fr/cas',
      service_url: 'http://node.crichard.fr',
      cas_version: '2.0',
      session_info: 'cas_infos'
    }
  }
};

const customConfig = require(configFile).config;
module.exports = assignObject(customConfig, config);
