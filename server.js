var io = require('socket.io').listen(8888);
var b = require('bonescript');
var TerryTee = require('./terrytee.js');


//var terry = new TerryTee('P9_16', 'P9_14', 1.0, 1.0 );
var terry = new TerryTee('P8_46', 'P8_45', 0.958, 1.0 );

terry.setSpeed( 0 );
terry.setHeading( 50 );

b.pinMode     ('P8_37', b.OUTPUT);
b.pinMode     ('P8_38', b.OUTPUT);
b.pinMode     ('P8_39', b.OUTPUT);
b.pinMode     ('P8_40', b.OUTPUT);
b.digitalWrite('P8_37', b.HIGH);
b.digitalWrite('P8_38', b.HIGH);
b.digitalWrite('P8_39', b.LOW);
b.digitalWrite('P8_40', b.LOW);

function printJSON(x) { console.log(JSON.stringify(x)); }
//b.analogWrite('P9_16', 0.7, 2000, printJSON);
//b.analogWrite('P9_14', 0.7, 2000, printJSON);




io.sockets.on('connection', function (socket) {
  // socket.emit('hi');
console.log("have connection");

  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
      socket.emit('ready');
    });
  });

  socket.on('msg', function () {
    socket.get('nickname', function (err, name) {
      console.log('Chat message by ', name);
    });
  });

  socket.on('message', function (m) {
      console.log('got message ', m );
  });
  socket.on('stop', function (v) {
      terry.setSpeed( 0 );
      terry.setHeading( 0 );
      terry.forceStop();
  });
  socket.on('speed', function (v) {
      console.log('set speed to ', v );
      console.log('set speed to ', v.value );
      if( typeof v.value === 'undefined')
	  return;

      terry.setSpeed( v.value );
  });
  socket.on('heading', function (v) {
//      console.log('set heading to ', v );
      if( typeof v.value === 'undefined')
	  return;

      terry.setHeading( v.value );
  });
});
