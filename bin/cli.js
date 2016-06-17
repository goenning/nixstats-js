#!/usr/bin/env node
'use strict';

var meow = require('meow');
var commands = require('./commands');
var ns = require('../lib');

var configStore = require('./config-store.js');
var config = configStore.read();

var clc = require('cli-color');

const cli = meow({
  help: `
    Usage
      $ nixstats <command>
    Command
      now
      config
    Examples
      $ nixstats reset                          #removes current saved token
      $ nixstats config <your_token_goes_here>  #saves token for further usages
      $ nixstats now                            #ouputs current servers and domains status
  `});

if (cli.input.length > 0) {
  var nsClient = new ns.NIXStatsClient(config.token);
  var commandName = cli.input[0];
  var command = commands[commandName];
  if (command) {
    command(nsClient, cli.input).catch((err) => {
      console.log(clc.red(err));
    });
  } else {
    console.log(clc.red(`Command '${commandName}' is unknown`));
  }
} else cli.showHelp();