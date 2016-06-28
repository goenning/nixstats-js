#!/usr/bin/env node
'use strict';

var meow = require('meow');
var commands = require('./commands');
var ns = require('../lib');
var clear = require('clear');
var configStore = require('./config-store.js');
var debug = require('debug')('nixstats');

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

clear();

var config = configStore.read();

if (cli.input.length > 0) {
  var nsClient = new ns.NIXStatsClient(config.token);
  var commandName = cli.input[0];
  var command = commands[commandName];
  if (command) {
    command(nsClient, cli).catch((err) => {
      debug(err);
      console.log('Something went wrong...'.red);
    });
  } else {
    console.log(`Command '${commandName}' is unknown`);
  }
} else cli.showHelp();