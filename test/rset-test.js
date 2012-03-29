var rs = require('../lib/rset.js');
var should = require('should');

describe('RSet', function() {
  var r;
  
  before(function(){
    r = new rs.RSet();
    r.processSop({sop:'state', rows:{'0':{id:'0',foo:12,bar:13},'1':{id:'1',foo:10,bar:14}}});
  });
  
  describe('initial data', function() {
    it('should return the initial data', function() {
      r.getRows().should.eql({'0':{bar:13,id:'0',foo:12},
                              '1':{bar:14,id:'1',foo:10}
                              });
    });
  });
  
  describe('insert row', function() {
    it('should emit an sop with the inserted row', function(done) {
      r.on('sop', function(sop) {
        sop.should.eql({sop:'insert',row:{id:'2',foo:6,bar:15}});
        done();
      });
      r.processSop({sop:'insert',row:{id:'2',foo:6,bar:15}});
    });
  });
});

describe('RSet', function() {
  var r;
  
  before(function(){
    r = new rs.RSet();
    r.init([{id:'0',foo:12,bar:13},{id:'1',foo:10,bar:14}]);
  });
  
  describe('delete row', function() {
    it('should emit an sop with the deleted row id', function(done) {
      r.on('sop', function(sop) {
        sop.should.eql({sop:'delete',id:'1'});
        done();
      });
      r.processSop({sop:'delete',id:'1'});
    });
  });
});