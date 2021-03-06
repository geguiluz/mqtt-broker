var mosca = require('mosca');
require('dotenv').config();

const mqttDB = process.env.ASC_URI;

// Configure the pub/sub settings with Mongo
var pubsubsettings = {
  // Using ascoltatore
  type: 'mongo',
  url: mqttDB,
  pubsubCollection: 'ascoltatori',
  mongo: {},
};

// Pass the pub/sub settings object (the one we created above) to our server
// (into our moscaSettings), through the 'backend' key.
var moscaSettings = {
  port: 1883, //mosca (mqtt) port
  backend: pubsubsettings, //pubsubsettings is the object we created above
};

var server = new mosca.Server(moscaSettings); //here we start mosca

// console.log(
//   'Credentials: ',
//   process.env.MQTT_USER,
//   process.env.MQTT_PASSWORD,
//   process.env.ASC_URI
// );

var authenticate = function(client, username, password, callback) {
  var authorized =
    username === process.env.MQTT_USER &&
    password.toString() === process.env.MQTT_PASSWORD;
  if (authorized) client.user = username;
  callback(null, authorized);
};

server.on('ready', setup); //on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
  server.authenticate = authenticate;
  console.log('Mosca server is up and running');
}

// fired when a client connects
server.on('clientConnected', function(client) {
  console.log('Client Connected:', client.id);
});

// fired when a message is published
server.on('published', function(packet, client) {
  // console.log('Published', packet.payload);
  // console.log('Client', client);
});
