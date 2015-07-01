var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var players = {}

io.on('connection', function (socket) {
  console.log('connection', socket.id)
  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    socket.broadcast.emit('disconnection', socket.id)
  })
  socket.on('new_player', function (params) {
  	players[params.id] = params.model
  	socket.broadcast.emit('disconnection', socket.id)
  })
  socket.emit('get_players', {players: players})
  /*
  socket.on('update_position', function (params) {
    params.id = socket.id
    socket.broadcast.emit('update_position', params)
  })
  */
})

console.log('server started on port', port)
