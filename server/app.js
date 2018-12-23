var server = require('http').createServer();
var io = require('socket.io')(server);

let clients = {}

io.on('connection', init);

function init (client) {

  client.on('login', function(username) {
    // push the client id into the clients array
    // clients.push({name: username, id: client.id})
    clients = {
      ...clients,
      [client.id]: { name: username, id: client.id }
    }

    // when a new client joins send his id to the current players
    io.sockets.emit('newClient', {name: username, id: client.id})

    // if client joins send him the current list of players
    // client.emit('newConnection', clients.filter(c => c.id !== client.id))

    client.emit('newConnection', clients)
    // console.log(':', clients.filter(c => c.id !== client.id) )
  })

  client.on('event', function(data){
    console.log('Event: ', data);
  });

  client.on('disconnect', function(){
    io.sockets.emit('clientLeft', client.id)
    delete clients[client.id]
  });

  client.on('accept', function(msg) {

    console.log('Accepted from: ', msg);
    io.sockets.to(msg).emit('invitationAccepted', msg)
  })

  client.on('deny', function(playerId) {
    io.sockets.to(playerId).emit('invitationDenied')
  })

  client.on('invite', function(invitation) {
    io.sockets.to(invitation.to).emit('private', invitation)
  })

  client.on('table', function(msg) {
    console.log(msg);
    io.sockets.to(msg.id).emit('tableUpdate', msg)
  })
}

server.listen(3000);