'use strict';

const _ = require('lodash');
const utils = require('./lib/utils');


class Midtrans {
  constructor(options) {
    this.credentials = _parseCredentials(options);
    this.isMultiple = _determineMultiple(options);

    this.transaction = require('./lib/midtrans/transaction')(this);
    this.snap = require('./lib/midtrans/snap')(this);
    this.notification = require('./lib/midtrans/notification')(this);
  }

  getBaseUrl(name) {
    if (this.isMultiple && !name) {
      throw new Error('Must provide parameter `name` for multiple account.');
    }

    if (!this.isMultiple && name) {
      throw new Error('Don\'t need extra param for single account.');
    }

    if (this.isMultiple && name) {
      if(!utils.hasProperty(this.credentials, [name])) {
        throw new Error(`Account with name: ${name} not found.`);
      }
      return (this.credentials[name].isProduction) ? Midtrans.PRODUCTION_BASE_URL : Midtrans.SANDBOX_BASE_URL;
    }

    return (this.credentials.isProduction) ? Midtrans.PRODUCTION_BASE_URL : Midtrans.SANDBOX_BASE_URL;
  }

  getSnapBaseUrl(name) {
    if (this.isMultiple && !name) {
      throw new Error('Must provide parameter `name` for multiple account.');
    }

    if (!this.isMultiple && name) {
      throw new Error('Don\'t need extra param for single account.');
    }

    if (this.isMultiple && name) {
      if(!utils.hasProperty(this.credentials, [name])) {
        throw new Error(`Account with name: ${name} not found.`);
      }
      return (this.credentials[name].isProduction) ? Midtrans.SNAP_PRODUCTION_BASE_URL : Midtrans.SNAP_SANDBOX_BASE_URL;
    }

    return (this.credentials.isProduction) ? Midtrans.SNAP_PRODUCTION_BASE_URL : Midtrans.SNAP_SANDBOX_BASE_URL;
  }

  getServerKey(name) {
    if (this.isMultiple && !name) {
      throw new Error('Must provide parameter `name` for multiple account.');
    }

    if (!this.isMultiple && name) {
      throw new Error('Don\'t need extra param for single account.');
    }

    if (this.isMultiple && name) {
      if(!utils.hasProperty(this.credentials, [name])) {
        throw new Error(`Account with name: ${name} not found.`);
      }
      return this.credentials[name].serverKey;
    }

    return this.credentials.serverKey;
  }

  getClientKey(name) {
    if (this.isMultiple && !name) {
      throw new Error('Must provide parameter `name` for multiple account.');
    }

    if (!this.isMultiple && name) {
      throw new Error('Don\'t need extra param for single account.');
    }

    if (this.isMultiple && name) {
      if(!utils.hasProperty(this.credentials, [name])) {
        throw new Error(`Account with name: ${name} not found.`);
      }
      return this.credentials[name].clientKey;
    }

    return this.credentials.clientKey;
  }
}

Midtrans.PRODUCTION_BASE_URL = 'https://api.veritrans.co.id/v2';
Midtrans.SANDBOX_BASE_URL = 'https://api.sandbox.veritrans.co.id/v2';
Midtrans.SNAP_PRODUCTION_BASE_URL = 'https://app.midtrans.com/snap/v1';
Midtrans.SNAP_SANDBOX_BASE_URL = 'https://app.sandbox.midtrans.com/snap/v1';

function _parseCredentials(options) {
  if (!_.isArray(options) && !_.isPlainObject(options)) {
    throw new Error('Options must either an Object or Array');
  }

  // Parse by its type
  if (_.isArray(options)) {
    let credentials = {};
    options.forEach(opt => {
      if (!utils.hasProperty(opt, ['name', 'clientKey', 'serverKey', 'isProduction'])) {
        throw new Error('Object in Array must contain property name, clientKey, serverKey, and isProduction!');
      }

      credentials[opt.name] = _.pick(opt, ['clientKey', 'serverKey', 'isProduction']);
    });

    return credentials;
  }

  if (_.isPlainObject(options)) {
    if (!utils.hasProperty(options, ['clientKey', 'serverKey', 'isProduction'])) {
      throw new Error('Object must contain property clientKey, serverKey, and isProduction!');
    }

    return _.pick(options, ['clientKey', 'serverKey', 'isProduction']);
  }
}

function _determineMultiple(options) {
  if (!_.isArray(options) && !_.isPlainObject(options)) {
    throw new Error('Options must either an Object or Array');
  }

  // Determine by its type
  if (_.isArray(options)) {
    return true;
  }

  if (_.isPlainObject(options)) {
    return false;
  }
}


module.exports = Midtrans;
