'use strict';

const configStore = require('../config-store.js');

module.exports = function(nsClient, cli) {
  return new Promise((resolve, reject) => {
    try {
      configStore.remove();
      resolve();
    } catch(err) {
      reject(err);
    }
  });
};