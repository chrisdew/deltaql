var ft = require('../lib/filter.js');
var rs = require('../lib/rset.js');
var should = require('should');

describe('Filter', function() {
  var r, f;
  
  before(function(){
    r = new rs.RSet();
    f = new ft.Filter(r, function(a) { return a.foo > 10; });  // f = r.filter(fn);
    r.processSop({sop:'state', rows:{'0':{id:'0',foo:12,bar:13},'1':{id:'1',foo:10,bar:14}}});
  });
  
  describe('initial data', function() {
    it('should return the initial data, filtered', function() {
      f.getRows().should.eql({'0':{bar:13,id:'0',foo:12}
                              });
    });
  });
  
  describe('insert row', function() {
    it('should emit an sop with the inserted row', function(done) {
      f.on('sop', function(sop) {
        sop.should.eql({sop:'insert',row:{id:'2',foo:16,bar:15}});
        done();
      });
      r.processSop({sop:'insert',row:{id:'2',foo:16,bar:15}});
    });
  });
});

describe('Filter', function() {
  var r, f;
  
  before(function(){
    r = new rs.RSet();
    f = new ft.Filter(r, function(a) { return a.foo > 10; });  // f = r.filter(fn);
    r.processSop({sop:'state', rows:{'0':{id:'0',foo:12,bar:13},'1':{id:'1',foo:10,bar:14}}});
  });
  
  describe('delete row', function() {
    it('should emit an sop with the deleted row id', function(done) {
      f.on('sop', function(sop) {
        sop.should.eql({sop:'delete',id:'0'});
        done();
      });
      r.processSop({sop:'delete',id:'0'});
    });
  });
});
