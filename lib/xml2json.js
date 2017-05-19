'use strict';
/**
 *
 * @param element
 * @param field
 * @param prefix
 * @returns {{}}
 */
var xml2json = (element, field, prefix) => {
  prefix = prefix || '';
  var ret = {};
  Array.from(element.childNodes).forEach((item) => {
    if (item.nodeType == 1 && (field.has(prefix + item.nodeName) || field.has(`${prefix}${item.nodeName}.`))) {
      var nodeName = item.nodeName;
      var hasChild = field.has(`${prefix}${nodeName}.`);

      if (hasChild
        || element.getElementsByTagName(nodeName).length > 1 // <a></a><a></a>
        || item.childNodes.length > 1 // <a>\n\r ...</a>
        || item.firstChild && item.firstChild.nodeType == 1) { // <a><b></b></a>
        if (!Array.isArray(ret[nodeName])) {
          ret[nodeName] = []; // {a: []}
        }
        ret[nodeName].push(
          item.childNodes.length == 0 ?
            hasChild ? {} : '' :
            item.childNodes.length == 1 && item.firstChild.nodeType == 3 ?
              item.firstChild.nodeValue : // <a>1</a> => a:['1']
              xml2json(item, field, `${prefix}${nodeName}.`)
        );
      } else {
        var value = item.firstChild ?
          item.firstChild.nodeValue :
          '';
        Array.isArray(ret[nodeName]) ?
          ret[nodeName].push(value) :
          ret[nodeName] = value;
      }
    }
  });
  return ret;
};

module.exports.xml2json = xml2json;
module.exports.completeDeficientAttr = (json, field) => {
  for (var v of field) {
    var index = v.indexOf('.');
    if (index < 0) {
      json[v] = json[v] || '';
    } else if (index == v.length - 1) {
      var key = v.slice(0, -1);
      json[key] = json[key] || [{}];
    }
  }
  return json;
};
