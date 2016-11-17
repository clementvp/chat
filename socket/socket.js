const io = require('../socket-manager').getManager();
const socketioJwt = require('socketio-jwt');
const {
  passServer,
  clients
} = require('../env.js');

io.on('connection', socketioJwt.authorize({
  secret: passServer+'uyzeghsdskqsoiizeuffh',
  timeout: 15000 // 15 seconds to send the authentication message
})).on('authenticated', function(client){
  client.on('name',(name)=>{
    clients[client.id] = name;
    io.emit('update-liste', clients);
    client.broadcast.emit('earn-client',name);
  });
  client.on('disconnect',()=>{
    client.broadcast.emit('lost-client',clients[client.id]);
    delete clients[client.id];
    io.emit('update-liste', clients);
  });
  client.on('message',(msg)=>{
    var regex = /(<([^>]+)>)/ig;
    msg = msg.replace(regex,"");
    client.broadcast.emit("msg", clients[client.id]+": "+msg);
  });
});
