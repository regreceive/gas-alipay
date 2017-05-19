'use strict';
var config  = require('./config');
var tls = require('tls');
var logger = require('./log/logInit');
var xaiHandle = require('./lib/xai');
var messageHandle = require('./lib/message');
var error = require('./lib/error');

var server = tls.createServer(config.tlsOptions, socket => {
  console.log('server connected',
    socket.authorized ? 'authorized' : 'unauthorized');

  socket.on('data', (msg) => {
    var json, data;

    try {
      data = messageHandle.decompose(msg);
    } catch(e) {
      logger.error(error.DecomposeMessageError);
      logger.debug(msg.toJSON());
    }

    try {
      json = JSON.parse(data);
    } catch(e) {
      logger.error(error.IncomingParameterParse2JSONError);
      logger.debug(data);
    }

    try {
      xaiHandle(json)
        .then(bodyJson => {
          json.body = bodyJson;
          var message = messageHandle.compose(json.head.servCode, JSON.stringify(json));
          socket.write(message);
        })
        .catch(errinfo => {
          logger.error(err);
          // ### send what?
        });
    } catch(err) {
      logger.error(err);
      // ### send what?
    }
  });

  // catch error prevent from server interrupting as enforced.
  socket.on('error', () => {
    console.log('closed connection');
  });

  socket.on('end', () => {
    server.close();
  });
}).listen(config.port, config.host || 'localhost', function () {
  console.log('listening on port', server.address().port);
});

server.on('tlsClientError', (exception, tlsSocket) => {
  console.log(1111);
});
