/*jshint quotmark:false*/
var lunr = require('lunr'),
  fs = require('fs'),
  path = require('path'),
  config = require('./config');

var noSearch = false;
try {
  var documents = JSON.parse(fs.readFileSync(path.join(config.dataDir, 'lunr-docs.json')));
  var serIndex = JSON.parse(fs.readFileSync(path.join(config.dataDir, 'lunr-index.json')));
} catch (e) {
  console.error("Failed to parse document or index json\n", e);
  noSearch = true;
}

if (!noSearch) {
  var index = lunr.Index.load(serIndex);
}

module.exports.search = function(query, callback) {
  var matches = index.search(query),
    results = [];
  matches.forEach(function(match) {
    var doc = documents.filter(function(doc) {
      return doc.id === match.ref;
    })[0];

    if (doc) doc.score = match.score;
    results.push(doc);
  });
  return callback(results);
};
