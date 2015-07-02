var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var bunnies = {}

io.on('connection', function (socket) {
  socket.broadcast.emit('hi')
  console.log('connection', socket.id)

  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    var id = socket.id
    delete bunnies[id]
    socket.broadcast.emit('inform_disconnection', id)
  })

  socket.on('update_position', function (pos) {
    pos.id = socket.id
    bunnies[pos.id] = pos
    socket.broadcast.emit('update_position', pos)
  })

  socket.on('just_connected', function (pos) {
    pos.id = socket.id
    bunnies[pos.id] = pos
    for (var key in bunnies) {
      var value = bunnies[key];
      socket.broadcast.emit('update_position', value)
    }
  })
})

console.log('server started on port', port)
