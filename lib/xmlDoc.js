'use strict';
module.exports = (cmName, data) => {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cm="http://oracle.com/${cmName}.xsd">
      <soapenv:Header/>
      <soapenv:Body>
        <cm:${cmName} faultStyle="wsdl">
          ${data}
        </cm:${cmName}>
      </soapenv:Body>
    </soapenv:Envelope>`;
};
