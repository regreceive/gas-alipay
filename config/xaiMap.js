'use strict';
var createSet = arrs => {
  var set = new Set();
  arrs.map(arr => {set.add(arr)});
  return set;
};

module.exports = {
  '100001': {
    name: 'CM_E_Paper',
    field: createSet(['rtnCode', 'rtnMsg', 'extend'])
  },
  '200001': {
    name: 'CM_E_GetDebt',
    field: createSet(['rtnCode', 'rtnMsg', 'consNo', 'consName', 'addr', 'orgNo', 'orgName',
    'acctOrgNo', 'capitalNo', 'consType', 'prepayAmt', 'totalOweAmt', 'totalRcvblAmt',
      'totalRcvedAmt', 'totalPenalty', 'recordCount', 'rcvblDet.', 'rcvblDet.rcvblAmtId',
      'rcvblDet.consNo', 'rcvblDet.consName', 'rcvblDet.orgNo', 'rcvblDet.orgName',
      'rcvblDet.acctOrgNo', 'rcvblDet.rcvblYm', 'rcvblDet.tPq', 'rcvblDet.rcvblAmt',
      'rcvblDet.rcvedAmt', 'rcvblDet.rcvblPenalty', 'rcvblDet.oweAmt', 'rcvblDet.extend'])
  },
  '200002': {
    name: 'CM_E_PayConf',
    field: createSet(['rtnCode', 'rtnMsg', 'extend']),
    shim: {
      'symbol-column': '|',
      'symbol-row': '|$',
      rcvDet: ['consNo', 'rcvblAmtId', 'rcvblYm', 'extendDet']
    }
  },
  '200012': {
    name: 'CM_E_PayReconf',
    field: createSet(['rtnCode', 'rtnMsg', 'instSerial', 'extend'])
  }

};

