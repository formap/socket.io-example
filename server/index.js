var port = process.env.PORT || 9000
var io = require('socket.io')(port)

io.on('connection', function (socket) {
  socket.broadcast.emit('hi')
  console.log('connection', socket.id)
  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
  })
  socket.on('update_position', function (pos) {
    pos.id = socket.id
    socket.broadcast.emit('update_position', pos)
  })
})

console.log('server started on port', port)
