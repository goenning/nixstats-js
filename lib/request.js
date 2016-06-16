'use strict';

const request = require('request');
const baseUrl = 'https://api.eu.nixstats.com/v1';
const querystring = require('querystring');

module.exports = (token, path, params) => {
  return new Promise((resolve, reject) => {

    var url = baseUrl + path;
    if (Object.keys(params).length > 0) {
      var qs = querystring.stringify(params);
      url = `${url}?${qs}`;
    }

    request({
      url: url,
      rejectUnauthorized: false,
      headers: {
        'Authorization': token
      }
    }, (err, response, body) => {
      if (!body)
        body = '{ }';

      if (err || response.statusCode != 200)
        reject(err || new Error(`Request failed with code ${response.statusCode}. The response body was ${body}.`));
      else
        resolve(JSON.parse(body));
    });
  });
};