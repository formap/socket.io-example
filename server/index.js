var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var bunnies = {}

io.on('connection', function (socket) {
  console.log('connection', socket.id)
  for (var bunnyId in bunnies) {
    socket.emit('update_position', bunnies[bunnyId])
  }
  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    socket.broadcast.emit('player_disconnected', socket.id)
  })
  socket.on('update_position', function (pos) {
    bunnies[socket.id] = pos
    pos.id = socket.id
    socket.broadcast.emit('update_position', pos)
  })
})

console.log('server started on port', port)
