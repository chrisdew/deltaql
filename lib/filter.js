// Filter is a sop->sop class

var util = require('util')
  , rs = require('./rset')
  ;

exports.Filter = Filter;

function Filter(parent, fn) {
  this.fn = fn;
  this.id = false;
  this.parent = parent;
  this.rows = {};
  
  var self = this;
  if (parent) {
    parent.on('sop', function(sop) { self.processSop(sop) });
    this.processSop({sop:'state',rows:parent.getRows()});
  }
}

util.inherits(Filter, rs.RSet);

// This is copied in from the RSet class, as the constructor needs it before
// the inheritance chain is setup.
Filter.prototype.processSop = function(sop) {
  if (sop.sop === 'state') this.processState(sop);
  if (sop.sop === 'delete') this.processDelete(sop);
  if (sop.sop === 'insert') this.processInsert(sop);
  if (sop.sop === 'update') this.processUpdate(sop);
}

Filter.prototype.processState = function(sop) {
  //console.log("processState", sop);
  this.rows = {};
  for (var id in sop.rows) {
    if (this.fn(sop.rows[id])) {
      //console.log("inc", sop.rows[id]);
      this.rows[sop.rows[id].id] = sop.rows[id];
    } else {
      //console.log("exc", sop.rows[id]);
    }
  }
  this.emit('sop', {sop:"state",rows:this.rows});
}

Filter.prototype.processDelete = function(sop) {
  //console.log("processDelete", sop);
  
  // checks
  if (!this.rows[sop.id]) {
    //console.log("processDelete: not found");
    return; // don't bother to delete records
            // which are alreadt filtered out
  }
  // action
  delete this.rows[sop.id];
  this.emit('sop', {sop:"delete",id:sop.id});
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

