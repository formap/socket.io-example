var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var players = {}

io.on('connection', function (socket) {
  console.log('connection', socket.id)
  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    socket.broadcast.emit('delete_player', socket.id)
    delete players[socket.id]
  })
  socket.on('update_position', function (params) {
    params.id = socket.id
    players[params.id] = {pos: params.pos, model: params.model}
    socket.broadcast.emit('update_position', params)
  })
  socket.emit('get_players', {players: players})
})

console.log('server started on port', port)
