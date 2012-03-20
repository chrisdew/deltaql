// RSet is a sop->sop class

var ev = require('events')
  , util = require('util')
  ;

function klone(ob) {
  return JSON.parse(JSON.stringify(ob));
}

function RSet(parent) {
  this.id = false;
  this.parent = parent;
  this.rows = {};
  
  var self = this;
  if (parent) {
    parent.on('sop', function(sop) { self.processSop(sop) });
    this.processSop({sop:'state',rows:parent.getRows()});
  }
}

util.inherits(RSet, ev.EventEmitter);

RSet.prototype.processSop = function(sop) {
  if (sop.sop === 'state') this.processState(sop);
  if (sop.sop === 'delete') this.processDelete(sop);
  if (sop.sop === 'insert') this.processInsert(sop);
  if (sop.sop === 'update') this.processUpdate(sop);
}

RSet.prototype.processState = function(sop) {
  this.rows = sop.rows;
  this.emit('sop', {sop:"state",rows:this.rows});
}

RSet.prototype.processDelete = function(sop) {
  // checks
  if (!this.rows[sop.id]) {
    this.emit('error', "bad delete");
    return;
  }
  
  // action
  delete this.rows[sop.id];
  this.emit('sop', {sop:"delete",id:sop.id});
}

RSet.prototype.processInsert = function(sop) {
  // checks
  if (this.rows[sop.id]) throw "bad insert";

  // action
  this.rows[sop.row.id] = sop.row;
  this.emit('sop', {sop:"insert",row:sop.row});
}

RSet.prototype.processUpdate = function(sop) {
  // checks
  if (!this.rows[sop.id]) throw "bad update";
  
  // action
  this.rows[osp.row.id] = sop.row;
  this.emit('sop', {sop:"update",row:sop.row});
}

RSet.prototype.getRows = function() {
  return klone(this.rows);
}

exports.RSet = RSet;