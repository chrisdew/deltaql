var rl = require('../lib/rlist.js');
var should = require('should');

describe('RList', function() {
  var r;
  
  before(function(){
    r = new rl.RList();
    r.processLop({lop:'state', rows:[{id:'0',foo:12,bar:13},{id:'1',foo:10,bar:14}]});
  });
  
  describe('initial data', function() {
    it('should return the initial data', function() {
      r.getRows().should.eql([{bar:13,id:'0',foo:12},
                              {bar:14,id:'1',foo:10}
                              ]);
    });
  });
  
  describe('insert row', function() {
    it('should emit an lop with the inserted row', function(done) {
      r.on('lop', function(lop) {
        lop.should.eql({lop:'insert',pos:0,row:{id:'2',foo:6,bar:15}});
        done();
      });
      r.processLop({lop:'insert',pos:0,row:{id:'2',foo:6,bar:15}});
    });
  });
});

describe('RList', function() {
  var r;
  
  before(function(){
    r = new rl.RList();
    r.processLop({lop:'state', rows:[{id:'0',foo:12,bar:13},{id:'1',foo:10,bar:14}]});
  });

  describe('delete row', function() {
    it('should emit an lop with the deleted row id', function(done) {
      r.on('lop', function(lop) {
        lop.should.eql({lop:'delete',pos:0});
        r.getRows().should.eql([{id:'1',foo:10,bar:14}]);
        done();
      });
      r.processLop({lop:'delete',pos:0});
    });
  });
});