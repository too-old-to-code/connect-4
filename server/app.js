var server = require('http').createServer();
var io = require('socket.io')(server);

let clients = {}

io.on('connection', init);

function init (client) {

  client.on('login', function(username) {
    // push the client id into the clients array
    clients = {
      ...clients,
      [client.id]: { name: username, id: client.id, busy: false }
    }

    // when a new client joins send his id to the current players
    io.sockets.emit('newClient', {name: username, id: client.id})

    // if client joins send him the current list of players
    client.emit('newConnection', clients)
  })

  client.on('event', function(data){
  });

  client.on('disconnect', function(){
    io.sockets.emit('clientLeft', client.id)
    delete clients[client.id]
  });

  client.on('occupied', function(id, busy) {
    if(clients[id]){
      clients[id].busy = busy
    }
    io.sockets.emit('playerBusyStatusChange', clients)
  })

  client.on('accept', function(msg) {
    io.sockets.to(msg.p1).emit('invitationAccepted', msg.p2)
  })

  client.on('deny', function(playerId) {
    io.sockets.to(playerId).emit('invitationDenied')
  })

  client.on('invite', function(invitation) {
    io.sockets.to(invitation.to).emit('private', invitation)
  })

  client.on('table', function(table, id) {
    io.sockets.to(id).emit('tableUpdate', table)
  })
}

server.listen(3000);