var tls = require('tls');
var fs = require('fs');

const host = 'localhost';
const port = 4001;
const options = {
    passphrase: 'longshine',
    key: fs.readFileSync('./cert/client.key'),
    cert: fs.readFileSync('./cert/client.pem'),
    ca: fs.readFileSync('./cert/ca.pem')
};


var socket = tls.connect(port, host, options, function () {
    console.log('client connected',
        socket.authorized ? 'authorized' : 'unauthorized');
    socket.setEncoding('utf8');
    process.stdin.pipe(socket, {end: false});
    socket.pipe(process.stdout);
});