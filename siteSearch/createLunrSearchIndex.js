var lunr = require('lunr'),
  fs = require('fs'),
  textNodes = require('./textNodeProcessor'),
  config = require('./config');


module.exports.create = function(done) {
  var nodeMetaData;
  textNodes.process(function(nodes) {
    var documents = nodes;

    var index = lunr(function() {
      this.field('body');
      this.ref('id');
    });

    var id = 0;
    var indexedDocs = [];
    Object.keys(documents).forEach(function(pageName) {
      var textNodes = documents[pageName];

      textNodes.forEach(function(node) {
        indexedDocs.push({
          body: node,
          pageName: pageName,
          id: id
        });
        ++id;
      });
    });

    indexedDocs.forEach(function(doc) {
      index.add(doc);
    });

    fs.writeFileSync(path.join(config.dataDir, 'lunr-docs.json'), JSON.stringify(indexedDocs));
    fs.writeFileSync(path.join(config.dataDir, 'lunr-index.json'), JSON.stringify(index.toJSON()));
  });
  done('Index successfully generated!');
};