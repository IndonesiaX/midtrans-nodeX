'use strict';

const axios = require('axios');
const utils = require('./utils');


function _apiCall(url, serverKey, params, post = true) {
  let opts = {
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic ' + utils.toBase64(serverKey + ':')
    }
  }

  if (post) {
    opts.method = 'post';
  } else {
    opts.method = 'get';
  }

  if (params) {
    opts.data = params;
  }

  return axios.request(opts);
}

module.exports = {
  get(url, serverKey, params) {
    return _apiCall(url, serverKey, params, false);
  },
  post(url, serverKey, params) {
    return _apiCall(url, serverKey, params, true);
  }
}
