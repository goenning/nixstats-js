'use strict';

var cliff = require('cliff');
var debug = require('debug')('nixstats');

var toGiga = (bytes) => Math.round(bytes / (1024 * 1024 * 1024));
var toMega = (kb) => Math.round(kb / 1024);

var formatStatus = (status) => {
  var upper = status.toUpperCase();
  return upper == 'UP' ? upper.green : upper.red;
};

var showDiskUsage = (df) => {
  var total = 0, used = 0;
  for(var disk of df) {
    used += disk.used_bytes;
    total += disk.used_bytes + disk.free_bytes;
  }
  return `${toGiga(used)}/${toGiga(total)} GB (${Math.round(used / total * 100)}%)`;
};

var showMemoryUsage = (memory) => {
  var free = memory.cached + memory.free + memory.buffer;
  var available = memory.total - free;
  var percMemoryFree = (1 - free/memory.total);

  var memoryBar = '';
  for(var i=0; i<20; i++) {
    memoryBar += i / 20 <= percMemoryFree ? '#' : ' ';
  }

  var colorfy = (text) => percMemoryFree >= 0.9 ? text.toString().red :
                          percMemoryFree >= 0.7 ? text.toString().yellow : text;

  return `[${colorfy(memoryBar)}] ${colorfy(toMega(available))}/${toMega(memory.total)} MB`;
};

function printDomains(domains) {
  var rows = [ [ 'Domain', 'Status', 'Uptime'] ];
  for (var domain of domains) {
    rows.push([domain.name, formatStatus(domain.status), parseFloat(domain.uptime_percentage.toFixed(3)) + '%']);
  }
  console.log(cliff.stringifyRows(rows, ['inverse']));
}

function printServers(servers) {
  var rows = [ [ 'Server', 'Status', 'CPU Load', 'Disk Usage', 'Memory Usage'] ];
  for (var server of servers) {
    rows.push([
      server.name,
      formatStatus(server.status),
      server.last_data.load,
      showDiskUsage(server.last_data.df),
      showMemoryUsage(server.last_data.memory)
    ]);
  }
  console.log(cliff.stringifyRows(rows, ['inverse']));
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