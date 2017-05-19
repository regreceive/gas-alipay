'use strict';
var exactTypeof = value => value.constructor.name;

// a: [{xx1: '1', xx2: '2', xx3: '3'}]  =>  <a><xx1>1</xx1><xx2>2</xx2><xx3>3</xx3></a>
var json2xml = (json) => {
  var result = [];
  if (exactTypeof(json) == 'Object') {
    Object.keys(json).forEach(key => {
      var child = json[key];
      if (Array.isArray(child)) {
        child.forEach(item => {
          result.push(
            item == '' ?
              `<${key} />` :
              `<${key}>${json2xml(item)}</${key}>`
          );
        });
      } else {
        result.push(
          child === '' ?
            `<${key} />` :
            `<${key}>${json2xml(child)}</${key}>`
        );
      }
    });
    result = result.join('');
  } else {
    result = json;
  }
  return result;
};

// a: '1|2|3|'  =>  a: [{xx1: '1', xx2: '2', xx3: '3'}]
var convertFrameToJSON = (json, shim, prefix)  => {
  if (!shim) {
    return json;
  }
  prefix = prefix || '';
  var type = exactTypeof(json);
  if (type == 'Object') {
    Object.keys(json).forEach(key => {
      json[key] = convertFrameToJSON(json[key], shim, `${prefix}${key}.`);
    });
  } else if (shim.hasOwnProperty( prefix.slice(0, -1)) && type == 'String') {
    prefix = prefix.slice(0, -1);
    json = json.slice(0, shim['symbol-row'].length * -1)  // slice '|$' which ends with
      .split(shim['symbol-row'])
      .map(row => {
        var d = {};
        row.split(shim['symbol-column']).forEach((col, i) => {
          d[shim[prefix][i]] = col;
        });
        return d;
      });
  }
  return json;
};

module.exports = {json2xml, convertFrameToJSON};
// Usage:
// var a = {
//   b:{rcvDet: '1|2|3|4|$1|2|3|4|$'}
// };
//
// console.log(
//   json2xml(
//     convertFrameToArray(a, {
//       'symbol-column': '|',
//       'symbol-row': '|$',
//       'b.rcvDet': ['consNo', 'rcvblAmtId', 'rcvblYm', 'extendDet']
//     })
//   )
// )

