const mysql = require('mysql');

module.exports = {
  debug: true,

  cas: {
    cas_url: 'https://cas.utc.fr/cas',
    service_url: process.env.url || 'http://node.crichard.fr/',
    cas_version: '2.0',
    session_info: 'cas_infos'
  },

  database: {
    host: 'localhost',
    username: process.env.sqluser || 'parserfb',
    password: process.env.sqlpass || 'parserfb',
    database: process.env.sqlbase || 'parserfb'
  },

  listenPort: 3651,

  init() {
    Array.prototype.contains = function(element) {
      return this.indexOf(element) > -1;
    };
    Array.prototype.findObjectByProp = function _findObjectByProp(prop, value) {
      for (let i = 0; i < this.length; i++) {
        if (this[i][prop] === value) {
          return this[i];
        }
      }
      return null;
    };

    Array.prototype.extend = function _extendArray(array) {
      if (typeof array === 'undefined') throw new Error('Argument 1 (and only) must be an array');
      this.push.apply(this, array); // eslint-disable-line prefer-spread
    };
    const pool = mysql.createPool({
      connectionLimit: 50,
      host: this.database.host,
      user: this.database.username,
      password: this.database.password,
      database: this.database.database
    });
    global.pool = pool;
  }
};
