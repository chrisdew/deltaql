// RList is a lop->lop class

var ev = require('events')
  , util = require('util')
  ;

function klone(ob) {
  return JSON.parse(JSON.stringify(ob));
}

function RList(parent) {
  this.id = false;
  this.parent = parent;
  this.rows = [];
  
  var self = this;
  if (parent) {
    parent.on('lop', function(lop) { self.processLop(lop) });
    this.processLop({lop:'state',rows:parent.getRows()});
  }
}

util.inherits(RList, ev.EventEmitter);

RList.prototype.processLop = function(lop) {
  if (lop.lop === 'state') this.processState(lop);
  if (lop.lop === 'delete') this.processDelete(lop);
  if (lop.lop === 'insert') this.processInsert(lop);
  if (lop.lop === 'replace') this.processReplace(lop);
  if (lop.lop === 'update') this.processUpdate(lop);
}

RList.prototype.processState = function(lop) {
  this.rows = lop.rows;
  this.emit('lop', {lop:"state",rows:this.rows});
}

RList.prototype.processDelete = function(lop) {
  // checks
  if (!this.rows[lop.pos]) console.log("bad delete", this.rows, lop);
  
  // action
  this.rows.splice([lop.pos], 1);
  this.emit('lop', {lop:"delete",pos:lop.pos});
}

RList.prototype.processInsert = function(lop) {
  // action
  this.rows.splice(lop.pos, 0, lop.row);
  this.emit('lop', {lop:"insert",pos:lop.pos,row:lop.row});
}

RList.prototype.processReplace = function(lop) {
  // checks
  if (!this.rows[lop.pos]) throw "bad replace";
  
  // action
  this.result.rows.splice(lop.pos, 1, lop.row);
  this.emit('lop', {lop:"replace",pos:lop.pos,val:lop.row});
}

RList.prototype.processUpdate = function(lop) {
  // checks
  if (this.rows[lop.pos].id !== lop.row.id) throw "bad update";
  
  // action
  this.rows.splice(pos, 1, lop.val);
  this.emit('lop', {lop:"update",pos:pos,row:lop.row});
}

RList.prototype.getRows = function() {
  return klone(this.rows);
}

exports.RList = RList;