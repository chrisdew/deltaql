var util = require('util')
  , rs = require('./rset')
  ;

exports.MysqlPersistor = MysqlPersistor;

function MysqlPersistor(parent, path) {
  this.parent = parent;
  this.path = path;
  this.rows = {};
  
  var self = this;
  if (parent) {
    parent.on('sop', function(sop) { self.processSop(sop) });
    this.processSop({sop:'state',rows:parent.getRows()});
  }
}

util.inherits(MysqlPersistor, rs.RSet);

MysqlPersistor.prototype.processSop = function(sop) {
  // use the sops to update a MySQL database
}