'use strict';
var tls = require('./tls');
var wsdl = require('./wsdl');

let config = {
  host: 'localhost',
  port: 4001
};

module.exports = Object.assign(config, tls, wsdl);
