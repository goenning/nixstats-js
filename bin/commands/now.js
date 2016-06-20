'use strict';

var cliff = require('cliff');
var debug = require('debug')('nixstats');

var formatStatus = (status) => {
  var upper = status.toUpperCase();
  return upper == 'UP' ? upper.green : upper.red;
};

function printDomains(domains) {
  var rows = [ [ 'Domain', 'Status', 'Uptime'] ];
  for (var domain of domains) {
    rows.push([domain.name, formatStatus(domain.status), parseFloat(domain.uptime_percentage.toFixed(3)) + '%']);
  }
  console.log(cliff.stringifyRows(rows, ['inverse','inverse','inverse']));
}

function printServers(servers) {
  var rows = [ [ 'Server', 'Status', 'Uptime', 'Load'] ];
  for (var server of servers) {
    rows.push([server.name, formatStatus(server.status), parseFloat(server.uptime.toFixed(3)) + '%', server.last_data.load]);
  }
  console.log(cliff.stringifyRows(rows, ['inverse','inverse','inverse','inverse']));
}

module.exports = function(nsClient, cli) {
  return Promise.all([
    nsClient.domain.list(),
    nsClient.server.list()
  ]).then((result) => {

    debug(`API call returned ${result[0].domains.length} domains and ${result[1].servers.length} servers.`);

    printDomains(result[0].domains);
    console.log();
    printServers(result[1].servers);

  });
};