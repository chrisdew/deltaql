var util = require('util')
  , rs = require('./rset')
  ;

exports.JsonPersistor = JsonPersistor;

function JsonPersistor(parent, path) {
  this.parent = parent;
  this.path = path;
  this.rows = {};
  
  var self = this;
  if (parent) {
    parent.on('sop', function(sop) { self.processSop(sop) });
    this.processSop({sop:'state',rows:parent.getRows()});
  }
  
  this.writeStream = fs.WriteStream(this.path + "/" + this.FILENAME, 
			{ flags: 'w', encoding: 'utf8', mode: 0666});
}

util.inherits(JsonPersistor, rs.RSet);

JsonPersistor.prototype.processSop = function(sop) {
  // just write the sops to a text file
}