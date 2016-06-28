'use strict';

const apiRequest = require('./request.js');

var NIXStatsClient = function(token) {
  this.request = (path, params) => {
    params = params || { };
    return apiRequest(token, path, params);
  };

  this.domain = {
    list: () => {
      return this.request('/domains');
    },
    overview: (id) => {
      return this.request(`/domain/${id}`);
    },
    statistics: (id, params) => {
      return this.request(`/domain/${id}/statistics`, params);
    },
    notifications: (id, params) => {
      return this.request(`/domain/${id}/notifications`, params);
    }
  };

  this.server = {
    list: () => {
      return this.request('/servers');
    },
    overview: (id) => {
      return this.request(`/server/${id}`);
    },
    stats: (id, params) => {
      return this.request(`/server/${id}/stats`, params);
    },
    uptime: (id, params) => {
      return this.request(`/server/${id}/uptime`, params);
    },
    process: (id, params) => {
      return this.request(`/server/${id}/process`, params);
    }
  };

};

module.exports.NIXStatsClient = NIXStatsClient;