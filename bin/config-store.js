'use strict';

var fs = require('fs');
var path = require('path');

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
  fs.writeFileSync(configFile, content);
}

function readConfigFile() {
  try {
    return JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
  } catch (err){
    return { };
  }
}

function removeConfigFile() {
  try {
    fs.unlinkSync(configFile);
    return true;
  } catch (err){
    return false;
  }
}

module.exports = {
  filePath: configFile,
  write: writeConfigFile,
  read: readConfigFile,
  remove: removeConfigFile
};