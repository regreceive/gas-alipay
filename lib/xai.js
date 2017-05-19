'use strict';
var http = require('http');
var DOMParser = require('xmldom').DOMParser;
var json2xml = require('./json2xml').json2xml;
var convertFrameToJSON = require('./json2xml').convertFrameToJSON;
var xml2json = require('./xml2json').xml2json;
var completeDeficientAttr = require('./xml2json').completeDeficientAttr;
var xmlDoc = require('./xmlDoc');
var wsdl = require('../config').wsdl;
var xaiMap = require('../config/xaiMap');
var error = require('./error');

var handle = data => {
  const servCode = data.head.servCode;
  const body = data.body;
  var xaiMatch = xaiMap[servCode];

  if (!xaiMatch) {
    throw error.UnimplementedXAI;
  }
  var xmlBody = json2xml(
    convertFrameToJSON(body, xaiMatch.shim)
  );
  var soap = xmlDoc(xaiMatch.name, xmlBody);
  return request(soap, xaiMatch);
};

var request = (soap, xaiMatch) => {
  var options = Object.assign({}, wsdl);
  options.path = `/spl/XAIApp/xaiserver/${xaiMatch.name}`;
  options.headers['Content-Length'] = soap.length;

  return new Promise((resolve, reject) => {
    var req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (data) => {
        if (res.statusCode == 200) {
          try {
            var bodyJson = getBody(data, xaiMatch);
          } catch(e) {
            reject(e);
          }
          resolve(bodyJson);
        } else {
          reject(res.statusCode);
        }
      });
      res.on('end', () => {
        console.log('No more data in response.')
      })
    });

    req.on('error', (e) => {
      reject(`problem with request: ${e.message}`);
    });
    req.write(soap);
    req.end();
  });
};

var getBody = (data, xaiMatch) => {
  // hack </body > error causing
  data = data.replace(/\x20+(?=>)/g, '');
  try {
  var bodyXml = new DOMParser()
    .parseFromString(data, 'text/xml')
    .getElementsByTagName('soapenv:Body')[0]
    .getElementsByTagName(xaiMatch.name)[0];
  } catch(e) {
    throw error.DomParseError;
  }
  try {
    var bodyJson = xml2json(bodyXml, xaiMatch.field);
    bodyJson = completeDeficientAttr(bodyJson, xaiMatch.field);
  } catch(e) {
    throw error.Dom2JsonParseError;
  }
  return bodyJson;
};


module.exports = handle;
