(function() {
  window.dql = {};
  dql.dqlID = ko.observable();
  dql.model = {};
})();

$(document).ready(function() {
  // make socketui connection
  var socket_url = '';//'http://81.187.221.93:8000';
  var socket = io.connect(socket_url, {secure: false, reconnect: true });
  socket.on('disconnect', function() { 
    console.log("disconnect", this.socket);
  }); 
  socket.on('connect', function() {
    console.log("connect", this.socket);
    if (!dql.dqlID()) {
      console.error('dql.sessionID must be called in your (base) template.')
      return;
    }
    socket.emit('auth', dql.dqlID());
  });
  socket.on('refresh', function() {
    console.warn('refresh');
    socket.disconnect();
    setTimeout(function() { location.reload(); }, 10000);
  });
  socket.on('lop', function(lop) {
    console.info('lop', lop);
    if (lop.lop === 'state') {
      if (!dql.model[lop.key]) {
        dql.model[lop.key] = ko.observableArray();
      }
      dql.model[lop.key](lop.rows);
    }
    if (lop.lop === 'insert') {
      if (!dql.model[lop.key]) {
        console.warn('unknown key:' + lop.key);
        return;
      }
      var obArr = dql.model[lop.key];
      console.info('splice', lop.key, ' ', lop.pos, ' ', 0, ' ', lop.row.message);
      obArr.splice(lop.pos, 0, lop.row);
      
      // work around for IE, which is only redrawing the lists if the last element
      // changes
      // FIXME: workaround not working
      //var tmp = obArr();
      //tmp.splice(lop.pos, 0, lop.row);
      //obArr(tmp);
    }
  });
  socket.on('initialised', function() {
    console.info('initialised');
    ko.applyBindings(dql.model, $("#body")[0]);
  });
});

/*
function initSocket(callback) {
  var timeout = false;
      sock = window.sock = new Sock();
      socket_url = '';//'http://81.187.221.93:8000';
      that = this;

  function Sock() {
    this.socket = io.connect(socket_url, {secure: false, reconnect: true });
    var that = this;
 
    this.socket.on('disconnect', function() { 
      console.log("disconnect", this.socket);
    }); 
    this.socket.on('connect', function() {
      that.onConnect();
    });
  };

  Sock.prototype.onConnect = function() {
    console.log("Sock::onConnect");
    callback(null, this.socket);
  };
    
  Sock.prototype.emit = function(channel, message) {
    this.socket.emit(channel, message);
  }
  
  Sock.prototype.on = function(event, fn) {
    this.socket.on(event, fn);
  }
  
  return;
}
*/