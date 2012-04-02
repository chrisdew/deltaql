// SioServer is a class

var ev = require('events'),
    util = require('util'),
    fs = require('fs'),
    sio = require('socket.io');
    
// FIXME: we need to find a way to get this path automatically
var deltaqlbrowser = fs.readFileSync('./node_modules/deltaql/lib/deltaqlbrowser.js').toString();

function SioServer(io) {
  this.io = io;
  this.nextDqlID = 1;
  this.dqlSessions = {};
  var that = this;
  io.sockets.on('connection', function(client) {
    console.info('client connected', client.store.id);
    client.on('auth', function(dqlID) {
      console.log('auth', dqlID);
      var dqlSess = that.dqlSessions[dqlID];
      if (!dqlSess) {
        // no session for this connection, most likely from a server restart,
        // then tell the client to refresh its page
        console.warn('unexpected dqlID:', dqlID, 'requesting page refresh');
        console.log('dqlSessions', that.dqlSessions[dqlID]);
        client.emit('refresh');
        return;
      }
      dqlSess.client = client;
      dqlSess.emitInitialState();
    });
  });
}

util.inherits(SioServer, ev.EventEmitter);

SioServer.prototype.configure = function(fn) {
  this.io.configure(fn);
}

SioServer.prototype.set = function(key, value) {
  this.io.set(key, value);
}

SioServer.prototype.register = function(req) {
  var dqlSess = new DqlSess(req, this.nextDqlID++);
  this.dqlSessions[dqlSess.dqlID] = dqlSess;
  console.log('register', dqlSess, dqlSess.dqlID);
  return dqlSess;
}
  
function DqlSess(req, num) {
  this.sessionID = req.sessionID;
  this.dqlID = req.dqlID = this.sessionID + ":" + req.url + ":" + num;
  console.log('page registered for dqlID:', req.dqlID);
  this.client = false;
  this.rlists = {};
}
  
DqlSess.prototype.add = function(key, rlist) {
  this.rlists[key] = rlist;
}
  
DqlSess.prototype.emitInitialState = function() {
  console.log('emitInitialState', this.rlists);
  for (var key in this.rlists) {
    var rlist = this.rlists[key];
    var client = this.client;
    rlist.on('lop', function(lop) {
      lop.key = key;
      client.emit('lop', lop);
    });
    client.emit('lop', {lop:"state",rows:rlist.rows,key:key});
  }  
  client.emit('initialised');
}

// factory method 
function listen(app) {
  // graft on the 'deltaqlbrowser.js' file
  app.get('/js/deltaqlbrowser.js', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(deltaqlbrowser);
  });
  var io = sio.listen(app);
  return new SioServer(io);
}

exports.listen = listen;
