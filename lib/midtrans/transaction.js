'use strict';

const requestor = require('../requestor');


module.exports = (Midtrans) => {
  function _makeApiCall(method, relativeUrl, payload, name) {
    const url = (name) ? Midtrans.getBaseUrl(name) + relativeUrl : Midtrans.getBaseUrl() + relativeUrl;
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
    // Purpose: Perform a transaction with various available payment methods and features
    charge(payload, name = null) {
      return _makeApiCall('POST', '/charge', payload, name);
    },
    // Purpose: Charge a Pre-Authorized transaction for card payment
    capture(payload, name = null) {
      return _makeApiCall('POST', '/capture', payload, name);
    },
    // Purpose: Approve a transaction with certain order_id which gets challenge
    //          status from Fraud Detection System
    approve(id, name = null) {
      return _makeApiCall('POST', `/${id}/approve`, {}, name);
    },
    // Purpose: Cancel a transaction with certain order_id.
    //          Cancelation can only be done before settlement process
    cancel(id, name = null) {
      return _makeApiCall('POST', `/${id}/cancel`, {}, name);
    },
    // Purpose: Changing order_id with pending status to be expired
    expire(id, name = null) {
      return _makeApiCall('POST', `/${id}/expire`, {}, name);
    },
    // Purpose: Get information status of a transaction with certain `order_id`
    status(id, name = null) {
      return _makeApiCall('GET', `/${id}/status`, null, name);
    }
  }

  return endpoints;
}
