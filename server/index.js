var port = process.env.PORT || 9000
var io = require('socket.io')(port)

var players = {}

io.on('connection', function (socket) {
  socket.broadcast.emit('hi')
  console.log('connection', socket.id)

  for (var key in players) {
      var value = players[key];
      socket.emit('update_position', value)
  }

  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    var id = socket.id
    delete players[id]
    socket.broadcast.emit('inform_disconnection', id)
  })

  socket.on('update_position', function (pos) {
    pos.id = socket.id
    players[socket.id] = pos
    socket.broadcast.emit('update_position', pos)
  })

})

console.log('server started on port', port)
