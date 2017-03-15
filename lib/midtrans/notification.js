'use strict';

const requestor = require('../requestor');
const debug = require('debug')('midtrans:notification');


module.exports = (Midtrans) => {

  const methods = {
    verify(id, signatureKey, name = null) {
      return new Promise((resolve, reject) => {
          Midtrans.transaction.status(id, name)
            .then((res) => {
              debug('Response data', res.data);

              debug('Comparing signature key...');
              debug('Received signature key: ', signatureKey);
              debug('Checked signature key: ', res.data.signature_key);

              if (signatureKey === res.data.signature_key) {
                resolve({
                  status: true,
                  data: res.data
                })
              } else {
                reject({
                  status: false,
                  data: res.data
                })
              }

            })
            .catch((err) => {
              debug('err', err);
              reject({
                status: 'error',
                data: 'Error checking status transaction.'
              })
            });
      });
    }
  }

  return methods;
}
