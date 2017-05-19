'use strict';
var pfx = require('fs').readFileSync('./cert/kserver.pfx');

module.exports = {
  tlsOptions : {
    passphrase: 'longshine',
    pfx,
    // key: fs.readFileSync('./cert/server.key'),
    // cert: fs.readFileSync('./cert/server.pem'),
    // ca: fs.readFileSync('./cert/client.pem'),
    requestCert: true,
    rejectUnauthorized: false
  }
};
