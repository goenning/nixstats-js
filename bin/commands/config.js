'use strict';

var configStore = require('../config-store.js');

module.exports = function(nsClient, args) {
  return new Promise((resolve, reject) => {
    try {
      configStore.write(JSON.stringify( { token: args[1] } ));
      resolve();
    } catch(err) {
      reject(err);
    }
  });
};