var rs = require('../lib/rset.js');
var should = require('should');

// utility functions
function cmp(a, b) { return a > b? 1 : a < b ? -1 : 0; }

describe('Filter', function() {
  var r, s;
  
  before(function(){
    r = new rs.RSet();
    s = r.sort(function(a, b) { return cmp(a.foo, b.foo); });
    r.processSop({sop:'state', rows:{'0':{id:'0',foo:12,bar:13},'1':{id:'1',foo:10,bar:14}}});
  });
  
  describe('initial data', function() {
    it('should return the initial data, filtered', function() {
      s.getRows().should.eql([{ id: '1', foo: 10, bar: 14 },
                              { id: '0', foo: 12, bar: 13 }
                              ]);
    });
  });
  /*
  describe('insert row', function() {
    it('should emit an sop with the inserted row', function(done) {
      s.on('sop', function(sop) {
        sop.should.eql({sop:'insert',row:{id:'2',foo:16,bar:15}});
        done();
      });
      s.processSop({sop:'insert',row:{id:'2',foo:16,bar:15}});
    });
  });
  */
});
/*
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
*/
