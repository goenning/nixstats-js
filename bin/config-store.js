'use strict';

var fs = require('fs');
var path = require('path');
var debug = require('debug')('nixstats');

var sep = (process.platform == 'win32') ? '\\' : '/';
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var configFile = `${homeDir}${sep}.config${sep}nixstats.json`;

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (directoryExists(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  }
  catch (err) {
    return false;
  }
}

function writeConfigFile(content) {
  ensureDirectoryExistence(configFile);
  debug('Token stored in configuration file.');
  fs.writeFileSync(configFile, content);
}

function readConfigFile() {
  try {
    var json = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
    debug('Configuration file found.');
    return json;
  } catch (err){
    debug('Could not read configuration file.', err);
    return { };
  }
}

function removeConfigFile() {
  try {
    fs.unlinkSync(configFile);
    debug('Configuration file removed.');
    return true;
  } catch (err){
    debug('Could not remove configuration file.', err);
    return false;
  }
}

module.exports = {
  filePath: configFile,
  write: writeConfigFile,
  read: readConfigFile,
  remove: removeConfigFile
};