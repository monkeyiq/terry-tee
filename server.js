var io = require('socket.io').listen(8888);
var b = require('bonescript');
var TerryTee = require('./terrytee.js');


//var terry = new TerryTee('P9_16', 'P9_14', 1.0, 1.0 );
var terry = new TerryTee('P8_46', 'P8_45', 0.958, 1.0,
			 'P8_37', 'P8_39',
			 'P8_38', 'P8_40' 
			);

terry.setSpeed( 0 );
terry.setHeading( 50 );


function printJSON(x) { console.log(JSON.stringify(x)); }


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
  socket.on('turnLeft', function (v) {
      terry.turnLeft();
  });
  socket.on('turnRight', function (v) {
      terry.turnRight();
  });
});
