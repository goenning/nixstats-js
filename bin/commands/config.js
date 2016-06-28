'use strict';

var configStore = require('../config-store.js');

module.exports = function(nsClient, cli) {
  return new Promise((resolve, reject) => {
    try {
      configStore.write(JSON.stringify( { token: cli.input[1] } ));
      resolve();
    } catch(err) {
      reject(err);
    }
  });
};