// Sort is a sop->lop class

var util = require('util')
  , rs = require('./rset')
  , rl = require('./rlist')
  ;

exports.Sort = Sort;

function Sort(parent, fn) {
  this.fn = fn;
  this.rows = [];  
  
  var self = this;
  console.log('sort', parent);
  if (parent) {
    parent.on('sop', function(sop) { self.processSop(sop) });
    this.processSop({sop:'state',rows:parent.getRows()});
  }
}

util.inherits(Sort, rl.RList);

// This is copied in from the RSet class, as the constructor needs it before
// the inheritance chain is setup.
Sort.prototype.processSop = function(sop) {
  if (sop.sop === 'state') this.processState(sop);
  if (sop.sop === 'delete') this.processDelete(sop);
  if (sop.sop === 'insert') this.processInsert(sop);
  if (sop.sop === 'update') this.processUpdate(sop);
}

Sort.prototype.processState = function(sop) {
  this.rows = [];
  for (var id in sop.rows) {
    this.rows.push(sop.rows[id]);
  }
  this.rows.sort(this.fn);
  this.emit('lop', {sop:"state",rows:this.rows});
}

/*
Sort.prototype.processDelete = function(sop) {
  // checks
  if (!this.rows[sop.rows[id]]) return; // don't bother to delete records
                                        // which are alreadt filtered out
  
  // action
  var id = this.rows[sop.row.id];  
  delete this.result.by_id[id];
  this.emit('sop', {sop:"delete",id:id});
}
*/
Sort.prototype.processInsert = function(sop) {
  // FIXME: replace with binary search
  var i;
  for (i = 0; i < this.rows.length; i++) {
    if (this.fn(this.rows[i],sop.row) > 0) {
      break;
    }
  }
  console.log('inserting at', i);
  this.rows.splice(i, 0, sop.row);
  this.emit('lop', {lop:"insert",pos:i,row:sop.row});
}
/*
Sort.prototype.processUpdate = function(sop) {
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

*/