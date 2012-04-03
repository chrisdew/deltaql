// A Silo is an RSet (row set) which
// a) has no parent and
// b) has methods to mutate its contents.

var util = require('util')
  , rs = require('./rset')
  ;

exports.Silo = Silo;

function Silo() {
  this.rows = {}; 
}

util.inherits(Silo, rs.RSet);


// insert adds a new row, which must have a unique id
Silo.prototype.insert = function(row, callback) {
  if (this.rows[row.id]) return callback('duplicate row id: ' + row.id);  
  this.processInsert({sop:'insert',row:row});
}

// update an existing row, which must already exist in the silo
Silo.prototype.update = function(row) {
  if (!this.rows[row.id]) return callback('row id: ' + row.id + ' not found');
  this.processUpdate({sop:'update',row:row});
}

// remove a row, or row id, from the silo
Silo.prototype.remove = function(row_or_id) {
  // allow removal by row or id
  var id = row_or_id.id ? row_or_id.id : row_or_id;
  if (!this.rows[row.id]) return callback('id: ' + id + ' not found');
  this.processDelete({sop:'delete',id:id});
}