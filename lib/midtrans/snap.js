'use strict';

const requestor = require('../requestor');


module.exports = (Midtrans) => {
  function _makeApiCall(method, relativeUrl, payload, name) {
    const url = (name) ? Midtrans.getSnapBaseUrl(name) + relativeUrl : Midtrans.getSnapBaseUrl() + relativeUrl;
    const serverKey = (name) ? Midtrans.getServerKey(name) : Midtrans.getServerKey();

    let calee;
    switch (method.toLowerCase()) {
      case 'get':
        calee = requestor.get;
        break;
      case 'post':
        calee = requestor.post;
        break;
      default:
        throw new Error('Invalid method. Only allowed GET and POST.');
    }

    return calee(url, serverKey, payload);
  }

  const endpoints = {
    // Purpose: Acquire SNAP_TOKEN by providing payload.
    // See here for payload: https://snap-docs.midtrans.com/#json-parameter-request-body
    transactions(payload, name = null) {
      return _makeApiCall('POST', '/transactions', payload, name);
    }
  }

  return endpoints;
}
