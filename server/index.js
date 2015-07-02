var port = process.env.PORT || 9000
var io = require('socket.io')(port)

var players = {}
var nPickUps = 10
//pickUps: id, x, y
var pickUps = generatePickups(nPickUps)

io.on('connection', function (socket) {
  socket.broadcast.emit('hi')
  console.log('connection', socket.id)

  for (var key in players) {
    var value = players[key];
    socket.emit('update_position', value)
  }

  for (var key in pickUps) {
    var value = pickUps[key]
    socket.emit('update_pickUp', value)
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
    detectColision(socket, pos)
    socket.broadcast.emit('update_position', pos)
  })

})

console.log('server started on port', port)

function generatePickups (n) {
  var pickUps = {}
  for (var i = 0; i < n; ++i) {
    var pu = {}
    pu.x = Math.trunc(Math.random() * 800)
    pu.y = Math.trunc(Math.random() * 600)
    pu.id = i
    pickUps[i] = pu
  }
  return pickUps
}

function detectColision (socketN, posPlayer) {
  for (var key in pickUps) {
    var value = pickUps[key]
    if (dist(posPlayer, value) < 50) {
      io.sockets.emit('delete_pickUp', value.id)
      delete pickUps[value.id]
    }
  }
}

function dist (pos1, pos2) {
  return Math.sqrt(((pos2.x - pos1.x) * (pos2.x - pos1.x)) + ((pos2.y - pos1.y) * (pos2.y - pos1.y)))
}
