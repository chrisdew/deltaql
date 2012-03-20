// Sort is a sop->lop class

var util = require('util')
  , rs = require('rset')
  ;

function Filter(parent, fn) {
  rs.RSet(parent);
  this.fn = fn;
  
  var self = this;
  if (parent) parent.on('sop', function(sop) { self.processSop(sop) });
}

util.inherits(Filter, rs.RSet);

Filter.prototype.processState = function(sop) {
  this.rows = {};
  for (var id in this.result.rows) {
    if (this.fn(sop.rows[id])) {
      this.rows[sop.rows[id].id] = sop.rows[id];
    }
  }
  this.emit('sop', {sop:"state",rows:this.rows});
}

Filter.prototype.processDelete = function(sop) {
  // checks
  if (!this.rows[sop.rows[id]]) return; // don't bother to delete records
                                        // which are alreadt filtered out
  
  // action
  var id = this.rows[sop.row.id];  
  delete this.result.by_id[id];
  this.emit('sop', {sop:"delete",id:id});
}

Filter.prototype.processInsert = function(sop) {
  // checks
  if (!this.fn(sop.row)) return; // row was filtered out
  
  // action
  this.rows[sop.row.id] = sop.row;
  this.emit('sop', {sop:"insert",row:sop.row});
}

Filter.prototype.processUpdate = function(sop) {
  // an update might cause:
  // a) an excluded row to be included,
  // b) an included row to be excluded,
  // c) an included row to be updated
  // d) an excluded row to be updated (and ignored)
  
  var included = this.rows[sop.row.id];
  var include = this.fn(sop.row);
  
  if (!included && include) {
    this.rows[sop.row.id] = sop.row;
    this.emit('sop', {sop:"insert",row:sop.row});
  } else if (included && !include) {
    delete this.rows[sop.row.id];
    this.emit('sop', {sop:"delete",id:sop.row.id});
  } else if (included && include) {
    this.rows[sop.row.id] = sop.row
    this.emit('sop', {sop:"update",id:sop.row});
  } else if (!included && !include) {
    // nothing to do
  } else {
    // this can never happen
    throw "unreachable code reached";
  }
}
