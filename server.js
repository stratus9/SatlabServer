//---------------------------------------------------------------------------
//----------------------- HTTP server ---------------------------------------
//---------------------------------------------------------------------------
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.get('/', function(req, res, next) {
//  res.sendFile(__dirname + '/index.html');
  res.sendFile('/home/ubuntu/SatlabWWW/ControlPanel/index.html');
}); 
console.log("Server is UP!");
server.listen(4200);

//---------------------------------------------------------------------------
//----------------------- Sockets setup -------------------------------------
//---------------------------------------------------------------------------
io.sockets.on('connection',
  function(socket) {
    console.log("We have a new client: " + socket.id);
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);

//---------------------------------------------------------------------------
//----------------------- Serial port stuff ---------------------------------
//---------------------------------------------------------------------------
serialport = require('serialport');

//---------------------------------------------------------------------------
//----------------------- Misc functions ------------------------------------
//---------------------------------------------------------------------------
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//---------------------------------------------------------------------------
//----------------------- Data update to www --------------------------------
//---------------------------------------------------------------------------
setInterval(dataUpdate, 1000);

function dataUpdate() {
  io.sockets.emit('update-msg', sensorDataPacket);
}

//---------------------------------------------------------------------------
//----------------------- Data update to DB ---------------------------------
//---------------------------------------------------------------------------
function sendSensorDataToDB(){
  console.log('Database updated');
}
//---------------------------------------------------------------------------
//----------------------- Data update from HW -------------------------------
//---------------------------------------------------------------------------
var sensorDataPacket;
var isNewSensorDataAvalable = false;
setInterval(HWupdate, 200);

function HWupdate() {
  sensorDataPacket = {
    coilXCurrent: 1200+getRandomArbitrary(-10,10),
    coilYCurrent: 200+getRandomArbitrary(-10,3),
    coilZCurrent: 50+getRandomArbitrary(-5,10),
    batteryLevel: 0.85+getRandomArbitrary(-0.1,0.1),
    batteryVoltage: 4.05+getRandomArbitrary(-0.05,0.05),
    status: 'RUN',
    sensorMagX: 40+getRandomArbitrary(-1,1),
    sensorMagY: 0+getRandomArbitrary(-1,1),
    sensorMagZ: -2+getRandomArbitrary(-1,1),
    orient:{
      q_a: 1,
      q_b: 3,
      q_c: 2,
      q_d: 0
    },
    omega:{
      omega_x: 1+getRandomArbitrary(-0.1,0.1),
      omega_y: 0.1+getRandomArbitrary(-0.1,0.1),
      omega_z: 10+getRandomArbitrary(-0.1,0.1)
    },
    position:{
      altitude: 300+6378,
      latitude: 50,
      longitude: 20
    }
  }
  sendSensorDataToDB();
}
