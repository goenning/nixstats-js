'use strict';

var CLI = require('clui'),
    clc = require('cli-color');

var Line          = CLI.Line,
    LineBuffer    = CLI.LineBuffer;

function printDomains(outputBuffer, domains) {
  new Line(outputBuffer)
    .column('Domain', 40, [clc.cyan])
    .column('Status', 7, [clc.cyan])
    .column('Uptime', 8, [clc.cyan])
    .fill()
    .store();

  for (var domain of domains) {
    new Line(outputBuffer)
      .column(domain.name, 40)
      .column(domain.status.toUpperCase(), 7, [domain.status == 'up' ? clc.green : clc.red])
      .column(parseFloat(domain.uptime_percentage.toFixed(3)) + '%', 8)
      .fill()
      .store();
  }
}

function printServers(outputBuffer, servers) {
  new Line(outputBuffer)
    .column('Server', 40, [clc.cyan])
    .column('Status', 7, [clc.cyan])
    .column('Uptime', 7, [clc.cyan])
    .column('Load', 16, [clc.cyan])
    .fill()
    .store();

  for (var server of servers) {
    new Line(outputBuffer)
      .column(server.name, 40)
      .column(server.status.toUpperCase(), 7, [server.status == 'up' ? clc.green : clc.red])
      .column(parseFloat(server.uptime.toFixed(3)) + '%', 7)
      .column(server.last_data.load, 16)

      .fill()
      .store();
  }
}

module.exports = function(nsClient) {
  return Promise.all([
    nsClient.domain.list(),
    nsClient.server.list()
  ]).then((result) => {

    var outputBuffer = new LineBuffer();
    printDomains(outputBuffer, result[0].domains);
    new Line(outputBuffer).fill().store();
    printServers(outputBuffer, result[1].servers);
    outputBuffer.output();

  });
};