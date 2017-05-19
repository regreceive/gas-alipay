'use strict';
// 1byte|4byte|6byte|data|1byte
module.exports.compose = (servCode, string) => {
  var length = Buffer.byteLength(string, 'utf-8');
  var message = new Buffer(12 + length);
  message.writeIntLE(0x68);
  message.writeInt32LE(length, 1);
  message.write(servCode, 5, 6);
  message.write(string, 11, length, 'utf8');
  message.writeIntLE(0x16, 11 + length);
  return message;
};

module.exports.decompose = message => {
  var length = message.readInt32LE(1);
  // start from 11
  var data = message.slice(11, length + 11);
  return data;
};
